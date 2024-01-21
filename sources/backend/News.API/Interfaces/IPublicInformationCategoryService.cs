using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IPublicInformationCategoryService
    {
        Task<ApiSuccessResult<PublicInformationCategoryDto>>
        GetPublicInformationCategoryByPaging(

                PublicInformationCategoryRequest publicInformationCategoryRequest,
                params Expression<Func<PublicInformationCategory, object>>[] includeProperties

        );

        Task<PublicInformationCategory> GetPublicInformationCategory(int id);

        Task CreatePublicInformationCategory(PublicInformationCategory publicInformationCategory);

        Task UpdatePublicInformationCategory(PublicInformationCategory publicInformationCategory);

        Task DeletePublicInformationCategory(int id);
        Task UpdateManyPublicInformationCategoryDto(List<int> lstFieldsNewsId, bool value, MultipleTypeUpdate multipleTypeUpdate);

        Task<List<PublicInformationCategory>> GetPublicInformationByCategory(PublicInformationCategoryRequest publicInformationCategoryRequest);
    }
}
