using System.Linq.Expressions;
using AutoMapper;
using Common.Enums;
using Common.Interfaces;
using Infrastructure.Implements;
using Infrastructure.Mappings;
using Infrastructure.Shared.Paging;
using Infrastructure.Shared.SeedWork;
using Models.Constants;
using Models.Dtos;
using Models.Entities;
using Models.Requests;
using News.API.Interfaces;
using News.API.Persistence;

namespace News.API.Services
{
    public class FeedbackService : RepositoryBase<Feedback, int, NewsContext>, IFeedbackService
    {
        private readonly IMapper _mapper;
        public FeedbackService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateFeedback(Feedback feedback)
        {
            await CreateAsync(feedback);
        }

        public async Task DeleteFeedback(int id)
        {
            var feedback = await GetByIdAsync(id);
            await DeleteAsync(feedback);
        }

        public async Task<Feedback> GetFeedback(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<FeedbackDto>> GetFeedbackByPaging(FeedbackRequest feedbackRequest, params Expression<Func<Feedback, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(feedbackRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(feedbackRequest.Keyword)));
            }
            if (feedbackRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == feedbackRequest.Status.Value);
            }
            PagedResult<Feedback>? sourcePaging = await query.PaginatedListAsync(feedbackRequest.CurrentPage
                                                                                             ?? 1, feedbackRequest.PageSize ?? CommonConstants.PAGE_SIZE, feedbackRequest.OrderBy2ndColumn, feedbackRequest.Direction2ndColumn, feedbackRequest.OrderBy, feedbackRequest.Direction);
            var lstDto = _mapper.Map<List<FeedbackDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<FeedbackDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<FeedbackDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateFeedback(Feedback product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<Feedback>> GetFeedbackNormalByPaging(FeedbackRequest feedbackRequest, params Expression<Func<Feedback, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (feedbackRequest.Ids != null && feedbackRequest.Ids.Count > 0)
            {
                query = query.Where(x => feedbackRequest.Ids.Contains(x.Id));
            }

            PagedResult<Feedback>? sourcePaging = await query.PaginatedListAsync(feedbackRequest.CurrentPage
                                                                                              ?? 0, feedbackRequest.PageSize ?? 0, feedbackRequest.OrderBy, feedbackRequest.Direction);
            ApiSuccessResult<Feedback>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyFeedbackDto(List<int> lstFeedbackId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstFeedbackDto = (await GetFeedbackNormalByPaging(new FeedbackRequest()
            {
                Ids = lstFeedbackId
            })).PagedData.Results.ToList();
            Action<Feedback> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<Feedback>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstFeedbackDto.ForEach(action);
                await UpdateListAsync(lstFeedbackDto);
            }
        }
    }
}