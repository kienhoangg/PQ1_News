using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface ICommentService
    {
        Task<ApiSuccessResult<CommentDto>>
        GetCommentByPaging(

                CommentRequest commentRequest,
                params Expression<Func<Comment, object>>[] includeProperties

        );

        Task<Comment> GetComment(long id);

        Task CreateComment(Comment comment);

        Task UpdateComment(Comment comment);

        Task DeleteComment(long id);
        Task UpdateManyCommentDto(List<int> lstCommentId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
