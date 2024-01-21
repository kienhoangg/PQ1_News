using System.Linq.Expressions;
using AutoMapper;
using Common.Enums;
using Common.Interfaces;
using Infrastructure.Implements;
using Infrastructure.Mappings;
using Infrastructure.Shared.Paging;
using Infrastructure.Shared.SeedWork;
using Microsoft.EntityFrameworkCore;
using Models.Constants;
using Models.Dtos;
using Models.Entities;
using Models.Requests;
using News.API.Interfaces;
using News.API.Persistence;
using Newtonsoft.Json;

namespace News.API.Services
{
    public class CommentService : RepositoryBase<Comment, long, NewsContext>, ICommentService
    {
        private readonly IMapper _mapper;
        private readonly ICategoryNewsService _categoryNewsService;
        public CommentService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork, ICategoryNewsService categoryNewsService) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _categoryNewsService = categoryNewsService;
        }

        public async Task CreateComment(Comment comment)
        {
            await CreateAsync(comment);
        }

        public async Task DeleteComment(long id)
        {
            var comment = await GetByIdAsync(id);
            await DeleteAsync(comment);
        }

        public async Task<Comment> GetComment(long id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<CommentDto>> GetCommentByPaging(CommentRequest commentRequest, params Expression<Func<Comment, object>>[] includeProperties)
        {
            IQueryable<Comment> query = null;

            if (commentRequest.CategoryNewsId.HasValue)
            {
                query = _categoryNewsService.GetCommentByCategoryNews(commentRequest);
            }
            else
            {
                query = FindAll(includeProperties: x => x.NewsPost);
                if (!string.IsNullOrEmpty(commentRequest.Keyword))
                {
                    query = query.Where((x => x.Username.Contains(commentRequest.Keyword)));
                }
                if (commentRequest.NewsPostId.HasValue)
                {
                    query = query.Where(x => x.NewsPostId == commentRequest.NewsPostId.Value);
                }

                if (commentRequest.Status.HasValue)
                {
                    query = query.Where(x => x.Status == commentRequest.Status.Value);
                }
            }


            PagedResult<Comment>? sourcePaging = await query.PaginatedListAsync(commentRequest.CurrentPage
                                                                                             ?? 1, commentRequest.PageSize ?? CommonConstants.PAGE_SIZE, commentRequest.OrderBy2ndColumn, commentRequest.Direction2ndColumn, commentRequest.OrderBy, commentRequest.Direction);
            var lstDto = _mapper.Map<List<CommentDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<CommentDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<CommentDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateComment(Comment product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<Comment>> GetCommentNormalByPaging(CommentRequest commentRequest, params Expression<Func<Comment, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (commentRequest.Ids != null && commentRequest.Ids.Count > 0)
            {
                query = query.Where(x => commentRequest.Ids.Contains((int)x.Id));
            }
            PagedResult<Comment>? sourcePaging = await query.PaginatedListAsync(commentRequest.CurrentPage
                                                                                              ?? 0, commentRequest.PageSize ?? 0, commentRequest.OrderBy, commentRequest.Direction);
            ApiSuccessResult<Comment>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyCommentDto(List<int> lstCommentId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstCommentDto = (await GetCommentNormalByPaging(new CommentRequest()
            {
                Ids = lstCommentId
            })).PagedData.Results.ToList();
            Action<Comment> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<Comment>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstCommentDto.ForEach(action);
                await UpdateListAsync(lstCommentDto);
            }
        }
    }
}