using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface ICategoryNewsService
    {
        Task<ApiSuccessResult<CategoryNewsDto>>
        GetCategoryNewsByPaging(

                CategoryNewsRequest categoryNewsRequest,
                params Expression<Func<CategoryNews, object>>[] includeProperties

        );

        Task<CategoryNews> GetCategoryNews(int id, params Expression<Func<CategoryNews, object>>[] includeProperties);

        Task CreateCategoryNews(CategoryNews categoryNews);

        Task UpdateCategoryNews(CategoryNews categoryNews);

        Task DeleteCategoryNews(int id);
        Task UpdateManyCategoryNewsDto(List<int> lstFieldsNewsId, bool value, MultipleTypeUpdate multipleTypeUpdate);
        IQueryable<Comment> GetCommentByCategoryNews(CommentRequest commentRequest);
        Task<CategoryNewsDto> GetCategoryNewsWithParentName(int id, params Expression<Func<CategoryNews, object>>[] includeProperties);
        Task<CategoryNews> GetCategoryNewsByCondition(Expression<Func<CategoryNews, bool>> expression);
        Task<CategoryNews> GetCategoryNewsFirstOrder();
        Task<List<CategoryNews>> GetNewsPostEachCategoryNews(CategoryNewsRequest categoryNewsRequest);
    }
}
