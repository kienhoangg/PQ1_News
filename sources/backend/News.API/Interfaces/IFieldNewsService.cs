using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IFieldNewsService
    {
        Task<ApiSuccessResult<FieldNewsDto>>
        GetFieldNewsByPaging(

                FieldNewsRequest fieldNewsRequest,
                params Expression<Func<FieldNews, object>>[] includeProperties

        );

        Task<FieldNews> GetFieldNews(int id);

        Task CreateFieldNews(FieldNews fieldNews);

        Task UpdateFieldNews(FieldNews fieldNews);

        Task DeleteFieldNews(int id);
        Task UpdateManyFieldNewsDto(List<int> lstFieldsNewsId, bool value, MultipleTypeUpdate multipleTypeUpdate);
        Task<List<FieldNews>> GetNewsPostEachFieldNews(FieldNewsRequest fieldNewsRequest);
    }
}
