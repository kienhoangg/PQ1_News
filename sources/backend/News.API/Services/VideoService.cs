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
    public class VideoService : RepositoryBase<Video, int, NewsContext>, IVideoService
    {
        private readonly IMapper _mapper;
        public VideoService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateVideo(Video video)
        {
            await CreateAsync(video);
        }

        public async Task DeleteVideo(int id)
        {
            var video = await GetByIdAsync(id);
            await DeleteAsync(video);
        }

        public async Task<Video> GetVideo(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<VideoDto>> GetVideoByPaging(VideoRequest videoRequest, params Expression<Func<Video, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(videoRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(videoRequest.Keyword)));
            }
            if (videoRequest.VideoCategoryId.HasValue)
            {
                query = query.Where(x => x.VideoCategoryId == videoRequest.VideoCategoryId);
            }
            if (videoRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == videoRequest.Status.Value);
            }
            PagedResult<Video>? sourcePaging = await query.PaginatedListAsync(videoRequest.CurrentPage
                                                                                             ?? 1, videoRequest.PageSize ?? CommonConstants.PAGE_SIZE, videoRequest.OrderBy2ndColumn, videoRequest.Direction2ndColumn, videoRequest.OrderBy, videoRequest.Direction);
            var lstDto = _mapper.Map<List<VideoDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<VideoDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<VideoDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateVideo(Video product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<Video>> GetVideoNormalByPaging(VideoRequest videoRequest, params Expression<Func<Video, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (videoRequest.Ids != null && videoRequest.Ids.Count > 0)
            {
                query = query.Where(x => videoRequest.Ids.Contains(x.Id));
            }

            PagedResult<Video>? sourcePaging = await query.PaginatedListAsync(videoRequest.CurrentPage
                                                                                              ?? 0, videoRequest.PageSize ?? 0, videoRequest.OrderBy, videoRequest.Direction);
            ApiSuccessResult<Video>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyVideoDto(List<int> lstVideoId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstVideoDto = (await GetVideoNormalByPaging(new VideoRequest()
            {
                Ids = lstVideoId
            })).PagedData.Results.ToList();
            Action<Video> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<Video>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstVideoDto.ForEach(action);
                await UpdateListAsync(lstVideoDto);
            }
        }
    }
}