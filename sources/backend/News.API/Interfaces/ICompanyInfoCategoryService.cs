using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface ICompanyInfoCategoryService
    {
        Task<ApiSuccessResult<CompanyInfoCategoryDto>>
        GetCompanyInfoCategoryByPaging(

                CompanyInfoCategoryRequest companyInfoCategoryRequest,
                params Expression<Func<CompanyInfoCategory, object>>[] includeProperties

        );

        Task<CompanyInfoCategory> GetCompanyInfoCategory(int id);

        Task CreateCompanyInfoCategory(CompanyInfoCategory companyInfoCategory);

        Task UpdateCompanyInfoCategory(CompanyInfoCategory companyInfoCategory);

        Task DeleteCompanyInfoCategory(int id);

        Task UpdateManyCompanyInfoCategoryDto(List<int> lstCompanyInfoCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
