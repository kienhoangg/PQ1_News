using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface ICompanyInfoService
    {
        Task<ApiSuccessResult<CompanyInfoDto>>
        GetCompanyInfoByPaging(

                CompanyInfoRequest companyInfoRequest,
                params Expression<Func<CompanyInfo, object>>[] includeProperties

        );

        Task<CompanyInfo> GetCompanyInfo(int id);

        Task CreateCompanyInfo(CompanyInfo companyInfo);

        Task UpdateCompanyInfo(CompanyInfo companyInfo);

        Task DeleteCompanyInfo(int id);
        Task UpdateManyCompanyInfoDto(List<int> lstCompanyInfoId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
