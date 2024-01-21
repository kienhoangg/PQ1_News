using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IRadioService
    {
        Task<ApiSuccessResult<RadioDto>>
        GetRadioByPaging(

                RadioRequest radioRequest,
                params Expression<Func<Radio, object>>[] includeProperties

        );

        Task<Radio> GetRadio(int id);

        Task CreateRadio(Radio radio);

        Task UpdateRadio(Radio radio);

        Task DeleteRadio(int id);
        Task UpdateManyRadioDto(List<int> lstFieldsNewsId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
