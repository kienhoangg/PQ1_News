using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IQuestionService
    {
        Task<ApiSuccessResult<QuestionDto>>
      GetQuestionByPaging(

              QuestionRequest fieldNewsRequest,
              params Expression<Func<Question, object>>[] includeProperties

      );

        Task<Question> GetQuestion(int id);

        Task CreateQuestion(Question question);

        Task UpdateQuestion(Question question);

        Task DeleteQuestion(int id);
        Task<QuestionHomeDto> GetQuestionHome();
        Task UpdateManyQuestionDto(List<int> lstQuestionId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}