using System.Linq.Expressions;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IRatingService
    {
        Task<ApiSuccessResult<RatingDto>>
        GetRatingByPaging(

                RatingRequest ratingRequest,
                params Expression<Func<Rating, object>>[] includeProperties

        );

        Task<Rating> GetRating(int id);

        Task CreateRating(Rating rating);

        Task UpdateRating(Rating rating);

        Task DeleteRating(int id);
    }
}
