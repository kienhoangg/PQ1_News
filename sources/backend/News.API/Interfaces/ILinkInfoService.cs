using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface ILinkInfoService
    {
        Task<ApiSuccessResult<LinkInfoDto>>
        GetLinkInfoByPaging(

                LinkInfoRequest linkInfoRequest,
                params Expression<Func<LinkInfo, object>>[] includeProperties

        );

        Task<LinkInfo> GetLinkInfo(int id);

        Task CreateLinkInfo(LinkInfo linkInfo);

        Task UpdateLinkInfo(LinkInfo linkInfo);

        Task DeleteLinkInfo(int id);
        Task UpdateManyLinkInfoDto(List<int> lstLinkInfoId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
