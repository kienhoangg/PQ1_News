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
    public class CompanyInfoService : RepositoryBase<CompanyInfo, int, NewsContext>, ICompanyInfoService
    {
        private readonly IMapper _mapper;
        public CompanyInfoService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateCompanyInfo(CompanyInfo companyInfo)
        {
            await CreateAsync(companyInfo);
        }

        public async Task DeleteCompanyInfo(int id)
        {
            var companyInfo = await GetByIdAsync(id);
            await DeleteAsync(companyInfo);
        }

        public async Task<CompanyInfo> GetCompanyInfo(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<CompanyInfoDto>> GetCompanyInfoByPaging(CompanyInfoRequest companyInfoRequest, params Expression<Func<CompanyInfo, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(companyInfoRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(companyInfoRequest.Keyword)));
            }
            if (companyInfoRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == companyInfoRequest.Status.Value);
            }
            PagedResult<CompanyInfo>? sourcePaging = await query.PaginatedListAsync(companyInfoRequest.CurrentPage
                                                                                             ?? 1, companyInfoRequest.PageSize ?? CommonConstants.PAGE_SIZE, companyInfoRequest.OrderBy2ndColumn, companyInfoRequest.Direction2ndColumn, companyInfoRequest.OrderBy, companyInfoRequest.Direction);
            var lstDto = _mapper.Map<List<CompanyInfoDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<CompanyInfoDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<CompanyInfoDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateCompanyInfo(CompanyInfo product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<CompanyInfo>> GetCompanyInfoNormalByPaging(CompanyInfoRequest companyInfoRequest, params Expression<Func<CompanyInfo, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (companyInfoRequest.Ids != null && companyInfoRequest.Ids.Count > 0)
            {
                query = query.Where(x => companyInfoRequest.Ids.Contains(x.Id));
            }
            PagedResult<CompanyInfo>? sourcePaging = await query.PaginatedListAsync(companyInfoRequest.CurrentPage
                                                                                              ?? 0, companyInfoRequest.PageSize ?? 0, companyInfoRequest.OrderBy, companyInfoRequest.Direction);
            ApiSuccessResult<CompanyInfo>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyCompanyInfoDto(List<int> lstCompanyInfoId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstCompanyInfoDto = (await GetCompanyInfoNormalByPaging(new CompanyInfoRequest()
            {
                Ids = lstCompanyInfoId
            })).PagedData.Results.ToList();
            Action<CompanyInfo> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<CompanyInfo>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstCompanyInfoDto.ForEach(action);
                await UpdateListAsync(lstCompanyInfoDto);
            }
        }
    }
}