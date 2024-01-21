using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IPhotoService
    {
        Task<ApiSuccessResult<PhotoDto>>
        GetPhotoByPaging(

                PhotoRequest photoRequest,
                params Expression<Func<Photo, object>>[] includeProperties

        );

        Task<Photo> GetPhoto(int id);

        Task CreatePhoto(Photo photo);

        Task UpdatePhoto(Photo photo);

        Task DeletePhoto(int id);
        Task UpdateManyPhotoDto(List<int> lstPhotoId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
