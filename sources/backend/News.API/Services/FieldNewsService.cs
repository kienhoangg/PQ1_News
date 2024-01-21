using System.Linq.Expressions;
using AutoMapper;
using Common.Enums;
using Common.Interfaces;
using Infrastructure.Implements;
using Infrastructure.Mappings;
using Infrastructure.Shared.Paging;
using Infrastructure.Shared.SeedWork;
using Models.Constants;
using Models.Dtos;
using Models.Entities;
using Models.Requests;
using News.API.Interfaces;
using News.API.Persistence;

namespace News.API.Services
{
    public class FieldNewsService : RepositoryBase<FieldNews, int, NewsContext>, IFieldNewsService
    {
        private readonly IMapper _mapper;
        public FieldNewsService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateFieldNews(FieldNews fieldNews)
        {
            await CreateAsync(fieldNews);
        }

        public async Task DeleteFieldNews(int id)
        {
            var fieldNews = await GetByIdAsync(id);
            await DeleteAsync(fieldNews);
        }

        public async Task<FieldNews> GetFieldNews(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<List<FieldNews>> GetNewsPostEachFieldNews(FieldNewsRequest fieldNewsRequest)
        {
            IQueryable<FieldNews> query = FindAll(includeProperties: x => x.NewsPosts);
            var currentPage = fieldNewsRequest.CurrentPage.HasValue ? fieldNewsRequest.CurrentPage.Value : 1;
            var pageSize = fieldNewsRequest.PageSize.HasValue ? fieldNewsRequest.PageSize.Value : 5;
            var result = query
            .Skip((currentPage - 1) * pageSize)
                                   .Take(pageSize).OrderBy(x => x.Order)
                        .Select(a => new { a, NewsPosts = a.NewsPosts.Skip(0).Take(5).ToList() })
                        .AsEnumerable()
                        .Select(x =>
                        {
                            x.a.NewsPosts = x.NewsPosts;
                            return x.a;
                        }).ToList();

            return result;
        }


        public async Task<ApiSuccessResult<FieldNewsDto>> GetFieldNewsByPaging(FieldNewsRequest fieldNewsRequest, params Expression<Func<FieldNews, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(fieldNewsRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(fieldNewsRequest.Keyword)));
            }
            if (fieldNewsRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == fieldNewsRequest.Status.Value);
            }
            PagedResult<FieldNews>? sourcePaging = await query.PaginatedListAsync(fieldNewsRequest.CurrentPage
                                                                                             ?? 1, fieldNewsRequest.PageSize ?? CommonConstants.PAGE_SIZE, fieldNewsRequest.OrderBy2ndColumn, fieldNewsRequest.Direction2ndColumn, fieldNewsRequest.OrderBy, fieldNewsRequest.Direction);
            var lstDto = _mapper.Map<List<FieldNewsDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<FieldNewsDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<FieldNewsDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateFieldNews(FieldNews product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<FieldNews>> GetFieldNewsNormalByPaging(FieldNewsRequest fieldNewsRequest, params Expression<Func<FieldNews, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (fieldNewsRequest.Ids != null && fieldNewsRequest.Ids.Count > 0)
            {
                query = query.Where(x => fieldNewsRequest.Ids.Contains(x.Id));
            }

            PagedResult<FieldNews>? sourcePaging = await query.PaginatedListAsync(fieldNewsRequest.CurrentPage
                                                                                              ?? 0, fieldNewsRequest.PageSize ?? 0, fieldNewsRequest.OrderBy, fieldNewsRequest.Direction);
            ApiSuccessResult<FieldNews>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyFieldNewsDto(List<int> lstFieldNewsId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstFieldNewsDto = (await GetFieldNewsNormalByPaging(new FieldNewsRequest()
            {
                Ids = lstFieldNewsId
            })).PagedData.Results.ToList();
            Action<FieldNews> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<FieldNews>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstFieldNewsDto.ForEach(action);
                await UpdateListAsync(lstFieldNewsDto);
            }
        }
    }
}