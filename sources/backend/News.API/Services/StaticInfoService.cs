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
    public class StaticInfoService : RepositoryBase<StaticInfo, int, NewsContext>, IStaticInfoService
    {
        private readonly IMapper _mapper;
        public StaticInfoService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateStaticInfo(StaticInfo staticInfo)
        {
            await CreateAsync(staticInfo);
        }

        public async Task DeleteStaticInfo(int id)
        {
            var staticInfo = await GetByIdAsync(id);
            await DeleteAsync(staticInfo);
        }

        public async Task<StaticInfo> GetStaticInfo(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<StaticInfoDto>> GetStaticInfoByPaging(StaticInfoRequest staticInfoRequest, params Expression<Func<StaticInfo, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(staticInfoRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(staticInfoRequest.Keyword)));
            }
            if (staticInfoRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == staticInfoRequest.Status.Value);
            }
            PagedResult<StaticInfo>? sourcePaging = await query.PaginatedListAsync(staticInfoRequest.CurrentPage
                                                                                             ?? 1, staticInfoRequest.PageSize ?? CommonConstants.PAGE_SIZE, staticInfoRequest.OrderBy2ndColumn, staticInfoRequest.Direction2ndColumn, staticInfoRequest.OrderBy, staticInfoRequest.Direction);
            var lstDto = _mapper.Map<List<StaticInfoDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<StaticInfoDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<StaticInfoDto>? result = new(paginationSet);
            return result;
        }

        public async Task<int> UpdateStaticInfo(StaticInfo product)
        {
            return await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<StaticInfo>> GetStaticInfoNormalByPaging(StaticInfoRequest staticInfoRequest, params Expression<Func<StaticInfo, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (staticInfoRequest.Ids != null && staticInfoRequest.Ids.Count > 0)
            {
                query = query.Where(x => staticInfoRequest.Ids.Contains(x.Id));
            }

            PagedResult<StaticInfo>? sourcePaging = await query.PaginatedListAsync(staticInfoRequest.CurrentPage
                                                                                              ?? 0, staticInfoRequest.PageSize ?? 0, staticInfoRequest.OrderBy, staticInfoRequest.Direction);
            ApiSuccessResult<StaticInfo>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyStaticInfoDto(List<int> lstStaticInfoId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstStaticInfoDto = (await GetStaticInfoNormalByPaging(new StaticInfoRequest()
            {
                Ids = lstStaticInfoId
            })).PagedData.Results.ToList();
            Action<StaticInfo> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<StaticInfo>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstStaticInfoDto.ForEach(action);
                await UpdateListAsync(lstStaticInfoDto);
            }
        }
    }
}