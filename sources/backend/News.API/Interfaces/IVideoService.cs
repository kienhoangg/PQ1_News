using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IVideoService
    {
        Task<ApiSuccessResult<VideoDto>>
        GetVideoByPaging(

                VideoRequest videoRequest,
                params Expression<Func<Video, object>>[] includeProperties

        );

        Task<Video> GetVideo(int id);

        Task CreateVideo(Video video);

        Task UpdateVideo(Video video);

        Task DeleteVideo(int id);
        Task UpdateManyVideoDto(List<int> lstVideoId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
