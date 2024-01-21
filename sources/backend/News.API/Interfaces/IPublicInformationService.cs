using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IPublicInformationService
    {
        Task<ApiSuccessResult<PublicInformationDto>>
        GetPublicInformationByPaging(

                PublicInformationRequest publicInformationRequest,
                params Expression<Func<PublicInformation, object>>[] includeProperties

        );

        Task<PublicInformation> GetPublicInformation(int id);

        Task CreatePublicInformation(PublicInformation publicInformation);

        Task UpdatePublicInformation(PublicInformation publicInformation);

        Task DeletePublicInformation(int id);
        Task UpdateManyPublicInformationDto(List<int> lstFieldsNewsId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
