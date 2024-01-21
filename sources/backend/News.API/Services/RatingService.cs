using System.Linq.Expressions;
using AutoMapper;
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
    public class RatingService : RepositoryBase<Rating, int, NewsContext>, IRatingService
    {
        private readonly IMapper _mapper;
        public RatingService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateRating(Rating rating)
        {
            await CreateAsync(rating);
        }

        public async Task DeleteRating(int id)
        {
            var rating = await GetByIdAsync(id);
            await DeleteAsync(rating);
        }

        public async Task<Rating> GetRating(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<RatingDto>> GetRatingByPaging(RatingRequest ratingRequest, params Expression<Func<Rating, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(ratingRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(ratingRequest.Keyword)));
            }
            PagedResult<Rating>? sourcePaging = await query.PaginatedListAsync(ratingRequest.CurrentPage
                                                                                             ?? 0, ratingRequest.PageSize ?? 0, ratingRequest.OrderBy, ratingRequest.Direction);
            var lstDto = _mapper.Map<List<RatingDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<RatingDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<RatingDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateRating(Rating product)
        {
            await UpdateAsync(product);
        }
    }
}