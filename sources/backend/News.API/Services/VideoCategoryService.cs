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
    public class VideoCategoryService : RepositoryBase<VideoCategory, int, NewsContext>, IVideoCategoryService
    {
        private readonly IMapper _mapper;
        public VideoCategoryService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateVideoCategory(VideoCategory videoCategory)
        {
            await CreateAsync(videoCategory);
        }

        public async Task DeleteVideoCategory(int id)
        {
            var videoCategory = await GetByIdAsync(id);
            await DeleteAsync(videoCategory);
        }

        public async Task<VideoCategory> GetVideoCategory(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<VideoCategoryDto>> GetVideoCategoryByPaging(VideoCategoryRequest videoCategoryRequest, params Expression<Func<VideoCategory, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(videoCategoryRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(videoCategoryRequest.Keyword)));
            }
            if (videoCategoryRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == videoCategoryRequest.Status.Value);
            }
            PagedResult<VideoCategory>? sourcePaging = await query.PaginatedListAsync(videoCategoryRequest.CurrentPage
                                                                                             ?? 1, videoCategoryRequest.PageSize ?? CommonConstants.PAGE_SIZE, videoCategoryRequest.OrderBy2ndColumn, videoCategoryRequest.Direction2ndColumn, videoCategoryRequest.OrderBy, videoCategoryRequest.Direction);
            var lstDto = _mapper.Map<List<VideoCategoryDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<VideoCategoryDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<VideoCategoryDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateVideoCategory(VideoCategory product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<VideoCategory>> GetVideoCategoryNormalByPaging(VideoCategoryRequest videoCategoryRequest, params Expression<Func<VideoCategory, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (videoCategoryRequest.Ids != null && videoCategoryRequest.Ids.Count > 0)
            {
                query = query.Where(x => videoCategoryRequest.Ids.Contains(x.Id));
            }

            PagedResult<VideoCategory>? sourcePaging = await query.PaginatedListAsync(videoCategoryRequest.CurrentPage
                                                                                              ?? 0, videoCategoryRequest.PageSize ?? 0, videoCategoryRequest.OrderBy, videoCategoryRequest.Direction);
            ApiSuccessResult<VideoCategory>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyVideoCategoryDto(List<int> lstVideoCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstVideoCategoryDto = (await GetVideoCategoryNormalByPaging(new VideoCategoryRequest()
            {
                Ids = lstVideoCategoryId
            })).PagedData.Results.ToList();
            Action<VideoCategory> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<VideoCategory>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstVideoCategoryDto.ForEach(action);
                await UpdateListAsync(lstVideoCategoryDto);
            }
        }
    }
}