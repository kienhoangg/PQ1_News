using System.Linq.Expressions;
using System.Threading.Tasks.Dataflow;
using AutoMapper;
using Common.Enums;
using Common.Interfaces;
using Infrastructure.Implements;
using Infrastructure.Mappings;
using Infrastructure.Shared.Paging;
using Infrastructure.Shared.SeedWork;
using Microsoft.EntityFrameworkCore;
using Models.Constants;
using Models.Dtos;
using Models.Entities;
using Models.Requests;
using News.API.Interfaces;
using News.API.Persistence;

namespace News.API.Services
{
    public class NewsPostService : RepositoryBase<NewsPost, long, NewsContext>, INewsPostService
    {
        private readonly IMapper _mapper;
        private readonly IFieldNewsService _fieldNewsService;
        private readonly ICategoryNewsService _categoryNewsService;

        public NewsPostService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork, IFieldNewsService fieldNewsService = null, ICategoryNewsService categoryNewsService = null) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _fieldNewsService = fieldNewsService;
            _categoryNewsService = categoryNewsService;
        }

        public async Task CreateNewsPost(NewsPost newsPost)
        {
            await CreateAsync(newsPost);
        }

        public async Task<int> DeleteNewsPost(long id)
        {
            var newsPost = await GetByIdAsync(id);
            return await DeleteAsync(newsPost);
        }

        public async Task<NewsPostCategoryEachFieldsDto> GetNewsPostCategoryEachFields(int fieldNewsid, NewsPostRequest newsPostRequest)
        {
            newsPostRequest.FieldNewsId = fieldNewsid;
            var categoryNews = await _categoryNewsService.GetCategoryNewsByCondition(x => x.FieldNews_SK_FK == fieldNewsid);
            var pagedNewsPost = await GetNewsPostByPagingWithoutContent(newsPostRequest);
            var newsPostCategoryEachFieldsDto = new NewsPostCategoryEachFieldsDto()
            {
                CategoryNews = _mapper.Map<CategoryNewsDto>(categoryNews),
                NewsPosts = pagedNewsPost.PagedData
            };
            return newsPostCategoryEachFieldsDto;
        }

        public async Task<ApiSuccessResult<NewsPostWithoutContentDto>> GetNewsPostEachCategoryNews(int categoryNewsId, NewsPostRequest newsPostRequest)
        {
            newsPostRequest.CategoryNewsId = categoryNewsId;
            var pagedNewsPost = await GetNewsPostByPagingWithoutContent(newsPostRequest, x => x.CategoryNews);

            return pagedNewsPost;
        }

        public async Task<ApiSuccessResult<NewsPostWithoutContentDto>> GetNewsPostEachCategoryNewsName(NewsPostRequest newsPostRequest)
        {
            var pagedNewsPost = await GetNewsPostByPagingWithoutContent(newsPostRequest, x => x.CategoryNews);

            return pagedNewsPost;
        }

        public async Task<NewsPost> GetNewsPost(long id, params Expression<Func<NewsPost, object>>[] includeProperties)
        {
            return await GetByIdAsync(id, includeProperties);
        }

        public async Task<ApiSuccessResult<NewsPost>> GetNewsPostNormalByPaging(NewsPostRequest newsPostRequest, params Expression<Func<NewsPost, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }
            if (!string.IsNullOrEmpty(newsPostRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(newsPostRequest.Keyword)));
            }
            if (newsPostRequest.CategoryNewsId.HasValue)
            {
                query = query.Where(x => x.CategoryNewsId == newsPostRequest.CategoryNewsId);
            }

            if (newsPostRequest.FieldNewsId.HasValue)
            {
                query = query.Where(x => x.FieldNewsId == newsPostRequest.FieldNewsId);
            }
            if (newsPostRequest.CollaboratorId.HasValue)
            {
                query = query.Where(x => x.CollaboratorId == newsPostRequest.CollaboratorId);
            }
            if (newsPostRequest.IsHotNews.HasValue)
            {
                query = query.Where(x => x.IsHotNews == newsPostRequest.IsHotNews.Value);
            }
            if (newsPostRequest.IsDocumentNews.HasValue)
            {
                query = query.Where(x => x.IsDocumentNews == newsPostRequest.IsDocumentNews.Value);
            }
            if (newsPostRequest.FromDate.HasValue && newsPostRequest.ToDate.HasValue)
            {
                var fromDate = newsPostRequest.FromDate.Value;
                var yesterday = new DateTime(fromDate.Year, fromDate.Month, fromDate.Day);
                yesterday = yesterday.AddTicks(-1);

                var todate = newsPostRequest.TodayDate.Value;
                var tomorrow = new DateTime(todate.Year, todate.Month, todate.Day);
                tomorrow = tomorrow.AddDays(1);
                tomorrow = tomorrow.AddTicks(-1);


                query = query.Where(x => x.PublishedDate < tomorrow && x.PublishedDate > yesterday);
            }
            if (newsPostRequest.FromDate.HasValue && !newsPostRequest.TodayDate.HasValue)
            {
                var today = newsPostRequest.FromDate.Value;
                var yesterday1 = new DateTime(today.Year, today.Month, today.Day);
                yesterday1 = yesterday1.AddTicks(-1);

                query = query.Where(x => x.PublishedDate > yesterday1);
            }
            if (newsPostRequest.TodayDate.HasValue && !newsPostRequest.FromDate.HasValue)
            {
                var today = newsPostRequest.TodayDate.Value;
                var tomorrow = new DateTime(today.Year, today.Month, today.Day);
                tomorrow = tomorrow.AddDays(1);
                tomorrow = tomorrow.AddTicks(-1);

                query = query.Where(x => x.PublishedDate < tomorrow);
            }
            if (newsPostRequest.ListNewsPostId != null && newsPostRequest.ListNewsPostId.Count > 0)
            {
                query = query.Where(x => newsPostRequest.ListNewsPostId.Contains(x.Id));
            }
            PagedResult<NewsPost>? sourcePaging = await query.PaginatedListAsync(newsPostRequest.CurrentPage
                                                                                              ?? 0, newsPostRequest.PageSize ?? 0, newsPostRequest.OrderBy, newsPostRequest.Direction);
            ApiSuccessResult<NewsPost>? result = new(sourcePaging);
            return result;
        }

        public async Task<ApiSuccessResult<NewsPostWithoutContentDto>> GetNewsPostByPagingWithoutContent(NewsPostRequest newsPostRequest, params Expression<Func<NewsPost, object>>[] includeProperties)
        {
            IQueryable<NewsPost> query = null;
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }
            else
            {
                query = FindAll();
            }
            if (!string.IsNullOrEmpty(newsPostRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(newsPostRequest.Keyword)));
            }
            if (newsPostRequest.CategoryNewsId.HasValue)
            {
                query = query.Where(x => x.CategoryNewsId == newsPostRequest.CategoryNewsId);
            }
            if (!String.IsNullOrEmpty(newsPostRequest.CategoryNewsName))
            {
                query = query.Where(x => x.CategoryNews.CategoryNewsName == newsPostRequest.CategoryNewsName);
            }

            if (newsPostRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == newsPostRequest.Status.Value);
            }

            if (newsPostRequest.FieldNewsId.HasValue)
            {
                query = query.Where(x => x.FieldNewsId == newsPostRequest.FieldNewsId);
            }
            if (newsPostRequest.CollaboratorId.HasValue)
            {
                query = query.Where(x => x.CollaboratorId == newsPostRequest.CollaboratorId);
            }
            if (newsPostRequest.IsHotNews.HasValue)
            {
                query = query.Where(x => x.IsHotNews == newsPostRequest.IsHotNews.Value);
            }
            if (newsPostRequest.IsDocumentNews.HasValue)
            {
                query = query.Where(x => x.IsDocumentNews == newsPostRequest.IsDocumentNews.Value);
            }
            if (newsPostRequest.FromDate.HasValue && newsPostRequest.ToDate.HasValue)
            {
                query = query.Where(x => x.PublishedDate <= newsPostRequest.FromDate.Value &&
                 x.PublishedDate >= newsPostRequest.ToDate.Value);
            }

            if (newsPostRequest.ListNewsPostId != null && newsPostRequest.ListNewsPostId.Count > 0)
            {
                query = query.Where(x => newsPostRequest.ListNewsPostId.Contains(x.Id));
            }

            PagedResult<NewsPost>? sourcePaging = await query.PaginatedListAsync(newsPostRequest.CurrentPage
                                                                                              ?? 1, newsPostRequest.PageSize ?? CommonConstants.PAGE_SIZE, newsPostRequest.OrderBy, newsPostRequest.Direction);
            var lstDto = _mapper.Map<List<NewsPostWithoutContentDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<NewsPostWithoutContentDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<NewsPostWithoutContentDto>? result = new(paginationSet);
            return result;
        }

        public async Task<ApiSuccessResult<NewsPostDto>> GetNewsPostByPaging(NewsPostRequest newsPostRequest, params Expression<Func<NewsPost, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }
            if (!string.IsNullOrEmpty(newsPostRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(newsPostRequest.Keyword)));
            }
            if (newsPostRequest.CategoryNewsId.HasValue)
            {
                query = query.Where(x => x.CategoryNewsId == newsPostRequest.CategoryNewsId);
            }
            if (newsPostRequest.SourceNewsId.HasValue)
            {
                query = query.Where(x => x.SourceNewsId == newsPostRequest.SourceNewsId);
            }
            var a = await query.ToListAsync();
            if (newsPostRequest.CategoryNewsId.HasValue)
            {
                query = query.Where(x => x.CategoryNewsId == newsPostRequest.CategoryNewsId);
            }

            if (newsPostRequest.FieldNewsId.HasValue)
            {
                query = query.Where(x => x.FieldNewsId == newsPostRequest.FieldNewsId);
            }
            if (newsPostRequest.CollaboratorId.HasValue)
            {
                query = query.Where(x => x.CollaboratorId == newsPostRequest.CollaboratorId);
            }
            if (newsPostRequest.IsHotNews.HasValue)
            {
                query = query.Where(x => x.IsHotNews == newsPostRequest.IsHotNews.Value);
            }
            if (newsPostRequest.IsDocumentNews.HasValue)
            {
                query = query.Where(x => x.IsDocumentNews == newsPostRequest.IsDocumentNews.Value);
            }
            if (newsPostRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == newsPostRequest.Status.Value);
            }
            if (newsPostRequest.FromDate.HasValue && newsPostRequest.ToDate.HasValue)
            {
                query = query.Where(x => x.CreatedDate < newsPostRequest.ToDate.Value && x.CreatedDate > newsPostRequest.FromDate.Value);
            }

            // if (newsPostRequest.FromDate.HasValue && newsPostRequest.ToDate.HasValue)
            // {
            //     var fromDate = newsPostRequest.FromDate.Value;
            //     var yesterday = new DateTime(fromDate.Year, fromDate.Month, fromDate.Day);
            //     yesterday = yesterday.AddTicks(-1);

            //     var todate = newsPostRequest.TodayDate.Value;
            //     var tomorrow = new DateTime(todate.Year, todate.Month, todate.Day);
            //     tomorrow = tomorrow.AddDays(1);
            //     tomorrow = tomorrow.AddTicks(-1);


            //     query = query.Where(x => x.PublishedDate < tomorrow && x.PublishedDate > yesterday);
            // }
            if (newsPostRequest.FromDate.HasValue && !newsPostRequest.TodayDate.HasValue)
            {
                var today = newsPostRequest.FromDate.Value;
                var yesterday1 = new DateTime(today.Year, today.Month, today.Day);
                yesterday1 = yesterday1.AddTicks(-1);

                query = query.Where(x => x.PublishedDate > yesterday1);
            }
            if (newsPostRequest.TodayDate.HasValue && !newsPostRequest.FromDate.HasValue)
            {
                var today = newsPostRequest.TodayDate.Value;
                var tomorrow = new DateTime(today.Year, today.Month, today.Day);
                tomorrow = tomorrow.AddDays(1);
                tomorrow = tomorrow.AddTicks(-1);

                query = query.Where(x => x.PublishedDate < tomorrow);
            }
            if (newsPostRequest.ListNewsPostId != null && newsPostRequest.ListNewsPostId.Count > 0)
            {
                query = query.Where(x => newsPostRequest.ListNewsPostId.Contains(x.Id));
            }

            PagedResult<NewsPost>? sourcePaging = await query.PaginatedListAsync(newsPostRequest.CurrentPage
                                                                                  ?? 0, newsPostRequest.PageSize ?? 0, newsPostRequest.OrderBy2ndColumn, newsPostRequest.Direction2ndColumn, newsPostRequest.OrderBy, newsPostRequest.Direction);
            var lstDto = _mapper.Map<List<NewsPostDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<NewsPostDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<NewsPostDto>? result = new(paginationSet);
            return result;
        }



        public async Task<int> UpdateNewsPost(NewsPost product)
        {
            return await UpdateAsync(product);
        }

        public async Task UpdateManyNewsPostDto(List<long> lstNewsPostId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {

            var lstNewsPostDto = (await GetNewsPostNormalByPaging(new NewsPostRequest()
            {
                ListNewsPostId = lstNewsPostId
            })).PagedData.Results.ToList();
            Action<NewsPost> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.IS_HOT_NEWS:
                    action = new Action<NewsPost>(x => x.IsHotNews = value);
                    break;
                case MultipleTypeUpdate.STATUS:
                    action = new Action<NewsPost>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                case MultipleTypeUpdate.VIEWS_COUNT:
                    action = new Action<NewsPost>(x => x.Views += 1);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstNewsPostDto.ForEach(action);
                await UpdateListAsync(lstNewsPostDto);
            }

        }
    }
}