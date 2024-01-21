using System.Linq.Expressions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public class SourceNewsService : RepositoryBase<SourceNews, int, NewsContext>, ISourceNewsService
    {
        private readonly IMapper _mapper;
        public SourceNewsService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateSourceNews(SourceNews sourceNews)
        {
            await CreateAsync(sourceNews);
        }

        public async Task DeleteSourceNews(int id)
        {
            var sourceNews = await GetByIdAsync(id);
            await DeleteAsync(sourceNews);
        }

        public async Task<SourceNews> GetSourceNews(int id)
        {
            return await GetByIdAsync(id);
        }
        public async Task<ApiSuccessResult<SourceNewsDto>> GetSourceNewsByPaging(SourceNewsRequest sourceNewsRequest, params Expression<Func<SourceNews, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(sourceNewsRequest.Keyword))
            {
                query = query.Where(x => x.Title.Contains(sourceNewsRequest.Keyword));
            }
            if (sourceNewsRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == sourceNewsRequest.Status.Value);
            }
            PagedResult<SourceNews>? sourcePaging = await query.PaginatedListAsync(sourceNewsRequest.CurrentPage
                                                                                             ?? 1, sourceNewsRequest.PageSize ?? CommonConstants.PAGE_SIZE, sourceNewsRequest.OrderBy2ndColumn, sourceNewsRequest.Direction2ndColumn, sourceNewsRequest.OrderBy, sourceNewsRequest.Direction);
            var lstDto = _mapper.Map<List<SourceNewsDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<SourceNewsDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<SourceNewsDto>? result = new(paginationSet);
            return result;
        }


        public async Task UpdateSourceNews(SourceNews product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<SourceNews>> GetSourceNewsNormalByPaging(SourceNewsRequest sourceNewsRequest, params Expression<Func<SourceNews, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (sourceNewsRequest.Ids != null && sourceNewsRequest.Ids.Count > 0)
            {
                query = query.Where(x => sourceNewsRequest.Ids.Contains(x.Id));
            }

            PagedResult<SourceNews>? sourcePaging = await query.PaginatedListAsync(sourceNewsRequest.CurrentPage
                                                                                              ?? 0, sourceNewsRequest.PageSize ?? 0, sourceNewsRequest.OrderBy, sourceNewsRequest.Direction);
            ApiSuccessResult<SourceNews>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManySourceNewsDto(List<int> lstSourceNewsId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstSourceNewsDto = (await GetSourceNewsNormalByPaging(new SourceNewsRequest()
            {
                Ids = lstSourceNewsId
            })).PagedData.Results.ToList();
            Action<SourceNews> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<SourceNews>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstSourceNewsDto.ForEach(action);
                await UpdateListAsync(lstSourceNewsDto);
            }
        }
    }
}