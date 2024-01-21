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
    public class RadioCategoryService : RepositoryBase<RadioCategory, int, NewsContext>, IRadioCategoryService
    {
        private readonly IMapper _mapper;
        public RadioCategoryService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateRadioCategory(RadioCategory radioCategory)
        {
            await CreateAsync(radioCategory);
        }

        public async Task DeleteRadioCategory(int id)
        {
            var radioCategory = await GetByIdAsync(id);
            await DeleteAsync(radioCategory);
        }

        public async Task<RadioCategory> GetRadioCategory(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<RadioCategoryDto>> GetRadioCategoryByPaging(RadioCategoryRequest radioCategoryRequest, params Expression<Func<RadioCategory, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(radioCategoryRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(radioCategoryRequest.Keyword)));
            }
            if (radioCategoryRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == radioCategoryRequest.Status.Value);
            }
            PagedResult<RadioCategory>? sourcePaging = await query.PaginatedListAsync(radioCategoryRequest.CurrentPage
                                                                                             ?? 0, radioCategoryRequest.PageSize ?? 0, radioCategoryRequest.OrderBy2ndColumn, radioCategoryRequest.Direction2ndColumn, radioCategoryRequest.OrderBy, radioCategoryRequest.Direction);
            var lstDto = _mapper.Map<List<RadioCategoryDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<RadioCategoryDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<RadioCategoryDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateRadioCategory(RadioCategory product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<RadioCategory>> GetRadioCategoryNormalByPaging(RadioCategoryRequest radioCategoryRequest, params Expression<Func<RadioCategory, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (radioCategoryRequest.Ids != null && radioCategoryRequest.Ids.Count > 0)
            {
                query = query.Where(x => radioCategoryRequest.Ids.Contains(x.Id));
            }

            PagedResult<RadioCategory>? sourcePaging = await query.PaginatedListAsync(radioCategoryRequest.CurrentPage
                                                                                              ?? 0, radioCategoryRequest.PageSize ?? 0, radioCategoryRequest.OrderBy, radioCategoryRequest.Direction);
            ApiSuccessResult<RadioCategory>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyRadioCategoryDto(List<int> lstRadioCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstRadioCategoryDto = (await GetRadioCategoryNormalByPaging(new RadioCategoryRequest()
            {
                Ids = lstRadioCategoryId
            })).PagedData.Results.ToList();
            Action<RadioCategory> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<RadioCategory>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstRadioCategoryDto.ForEach(action);
                await UpdateListAsync(lstRadioCategoryDto);
            }
        }
    }
}