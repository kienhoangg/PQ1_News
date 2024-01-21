using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IQuestionCategoryService
    {
        Task<ApiSuccessResult<QuestionCategoryDto>>
      GetQuestionCategoryByPaging(

              QuestionCategoryRequest fieldNewsRequest,
              params Expression<Func<QuestionCategory, object>>[] includeProperties

      );

        Task<QuestionCategory> GetQuestionCategory(int id);

        Task CreateQuestionCategory(QuestionCategory questionCategory);

        Task UpdateQuestionCategory(QuestionCategory questionCategory);

        Task DeleteQuestionCategory(int id);
        Task<List<QuestionCategory>> GetAllQuestionCategories();

        Task UpdateManyQuestionCategoryDto(List<int> lstQuestionCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}