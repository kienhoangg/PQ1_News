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
    public class CompanyInfoCategoryService : RepositoryBase<CompanyInfoCategory, int, NewsContext>, ICompanyInfoCategoryService
    {
        private readonly IMapper _mapper;
        public CompanyInfoCategoryService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateCompanyInfoCategory(CompanyInfoCategory companyInfoCategory)
        {
            await CreateAsync(companyInfoCategory);
        }

        public async Task DeleteCompanyInfoCategory(int id)
        {
            var companyInfoCategory = await GetByIdAsync(id);
            await DeleteAsync(companyInfoCategory);
        }

        public async Task<CompanyInfoCategory> GetCompanyInfoCategory(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<CompanyInfoCategoryDto>> GetCompanyInfoCategoryByPaging(CompanyInfoCategoryRequest companyInfoCategoryRequest, params Expression<Func<CompanyInfoCategory, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(companyInfoCategoryRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(companyInfoCategoryRequest.Keyword)));
            }
            if (companyInfoCategoryRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == companyInfoCategoryRequest.Status.Value);
            }
            PagedResult<CompanyInfoCategory>? sourcePaging = await query.PaginatedListAsync(companyInfoCategoryRequest.CurrentPage
                                                                                             ?? 1, companyInfoCategoryRequest.PageSize ?? CommonConstants.PAGE_SIZE, companyInfoCategoryRequest.OrderBy2ndColumn, companyInfoCategoryRequest.Direction2ndColumn, companyInfoCategoryRequest.OrderBy, companyInfoCategoryRequest.Direction);
            var lstDto = _mapper.Map<List<CompanyInfoCategoryDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<CompanyInfoCategoryDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<CompanyInfoCategoryDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateCompanyInfoCategory(CompanyInfoCategory product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<CompanyInfoCategory>> GetCompanyInfoCategoryNormalByPaging(CompanyInfoCategoryRequest companyInfoCategoryRequest, params Expression<Func<CompanyInfoCategory, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (companyInfoCategoryRequest.Ids != null && companyInfoCategoryRequest.Ids.Count > 0)
            {
                query = query.Where(x => companyInfoCategoryRequest.Ids.Contains(x.Id));
            }
            PagedResult<CompanyInfoCategory>? sourcePaging = await query.PaginatedListAsync(companyInfoCategoryRequest.CurrentPage
                                                                                              ?? 0, companyInfoCategoryRequest.PageSize ?? 0, companyInfoCategoryRequest.OrderBy, companyInfoCategoryRequest.Direction);
            ApiSuccessResult<CompanyInfoCategory>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyCompanyInfoCategoryDto(List<int> lstCompanyInfoCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstCompanyInfoCategoryDto = (await GetCompanyInfoCategoryNormalByPaging(new CompanyInfoCategoryRequest()
            {
                Ids = lstCompanyInfoCategoryId
            })).PagedData.Results.ToList();
            Action<CompanyInfoCategory> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<CompanyInfoCategory>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstCompanyInfoCategoryDto.ForEach(action);
                await UpdateListAsync(lstCompanyInfoCategoryDto);
            }
        }
    }
}