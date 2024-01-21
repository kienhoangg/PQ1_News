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
    public class PhotoCategoryService : RepositoryBase<PhotoCategory, int, NewsContext>, IPhotoCategoryService
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public PhotoCategoryService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork, IPhotoService photoService) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _photoService = photoService;
        }

        public async Task CreatePhotoCategory(PhotoCategory photoCategory)
        {
            await CreateAsync(photoCategory);
        }

        public async Task DeletePhotoCategory(int id)
        {
            var photoCategory = await GetByIdAsync(id);
            await DeleteAsync(photoCategory);
        }

        public async Task<PhotoCategory> GetPhotoCategory(int id, params Expression<Func<PhotoCategory, object>>[] includeProperties)
        {
            return await GetByIdAsync(id, includeProperties);
        }

        public async Task<PhotoCategoryDto> GetPhotoCategoryWithParentName(int id, params Expression<Func<PhotoCategory, object>>[] includeProperties)
        {
            var photoCategoryDto = _mapper.Map<PhotoCategoryDto>(await GetPhotoCategory(id, includeProperties));
            if (photoCategoryDto.ParentId.HasValue && photoCategoryDto.ParentId != 0)
            {
                photoCategoryDto.ParentName = (await GetPhotoCategory(photoCategoryDto.ParentId.Value)).Title;
            }
            return photoCategoryDto;
        }

        public async Task<ApiSuccessResult<PhotoCategoryDto>> GetPhotoCategoryByPaging(PhotoCategoryRequest photoCategoryRequest, params Expression<Func<PhotoCategory, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(photoCategoryRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(photoCategoryRequest.Keyword)));
            }
            if (photoCategoryRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == photoCategoryRequest.Status.Value);
            }

            if (photoCategoryRequest.ParentId.HasValue)
            {
                query = query.Where(x => x.ParentId == photoCategoryRequest.ParentId.Value);
            }
            PagedResult<PhotoCategory>? sourcePaging = await query.PaginatedListAsync(photoCategoryRequest.CurrentPage
                                                                                             ?? 1, photoCategoryRequest.PageSize ?? CommonConstants.PAGE_SIZE, photoCategoryRequest.OrderBy2ndColumn, photoCategoryRequest.Direction2ndColumn, photoCategoryRequest.OrderBy, photoCategoryRequest.Direction);
            var lstDto = _mapper.Map<List<PhotoCategoryDto>>(sourcePaging.Results);
            foreach (var item in lstDto)
            {
                var photo = (await _photoService.GetPhotoByPaging(new PhotoRequest()
                {
                    CurrentPage = 1,
                    PageSize = 1,
                    PhotoCategoryId = item.Id
                })).PagedData.Results.ToList().FirstOrDefault();
                if (photo != null && !String.IsNullOrEmpty(photo.ImagePath))
                {
                    if (photo.ImagePath.Contains(";;"))
                    {
                        item.Avatar = photo.ImagePath.Split(";;")[0];
                    }
                    else
                    {
                        item.Avatar = photo.ImagePath;
                    }
                }
            }
            var paginationSet = new PagedResult<PhotoCategoryDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<PhotoCategoryDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdatePhotoCategory(PhotoCategory product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<PhotoCategory>> GetPhotoCategoryNormalByPaging(PhotoCategoryRequest photoCategoryRequest, params Expression<Func<PhotoCategory, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (photoCategoryRequest.Ids != null && photoCategoryRequest.Ids.Count > 0)
            {
                query = query.Where(x => photoCategoryRequest.Ids.Contains(x.Id));
            }

            PagedResult<PhotoCategory>? sourcePaging = await query.PaginatedListAsync(photoCategoryRequest.CurrentPage
                                                                                              ?? 0, photoCategoryRequest.PageSize ?? 0, photoCategoryRequest.OrderBy, photoCategoryRequest.Direction);
            ApiSuccessResult<PhotoCategory>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyPhotoCategoryDto(List<int> lstPhotoCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstPhotoCategoryDto = (await GetPhotoCategoryNormalByPaging(new PhotoCategoryRequest()
            {
                Ids = lstPhotoCategoryId
            })).PagedData.Results.ToList();
            Action<PhotoCategory> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<PhotoCategory>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstPhotoCategoryDto.ForEach(action);
                await UpdateListAsync(lstPhotoCategoryDto);
            }
        }
    }
}