using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IFeedbackService
    {
        Task<ApiSuccessResult<FeedbackDto>>
        GetFeedbackByPaging(

                FeedbackRequest feedbackRequest,
                params Expression<Func<Feedback, object>>[] includeProperties

        );

        Task<Feedback> GetFeedback(int id);

        Task CreateFeedback(Feedback feedback);

        Task UpdateFeedback(Feedback feedback);

        Task DeleteFeedback(int id);
        Task UpdateManyFeedbackDto(List<int> lstFieldsNewsId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
