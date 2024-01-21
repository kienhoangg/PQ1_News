using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IRadioCategoryService
    {
        Task<ApiSuccessResult<RadioCategoryDto>>
        GetRadioCategoryByPaging(

                RadioCategoryRequest radioCategoryRequest,
                params Expression<Func<RadioCategory, object>>[] includeProperties

        );

        Task<RadioCategory> GetRadioCategory(int id);

        Task CreateRadioCategory(RadioCategory radioCategory);

        Task UpdateRadioCategory(RadioCategory radioCategory);

        Task DeleteRadioCategory(int id);
        Task UpdateManyRadioCategoryDto(List<int> lstFieldsNewsId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
