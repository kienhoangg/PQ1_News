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
    public class StaticCategoryService : RepositoryBase<StaticCategory, int, NewsContext>, IStaticCategoryService
    {
        private readonly IMapper _mapper;
        public StaticCategoryService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateStaticCategory(StaticCategory staticCategory)
        {
            await CreateAsync(staticCategory);
        }

        public async Task DeleteStaticCategory(int id)
        {
            var staticCategory = await GetByIdAsync(id);
            await DeleteAsync(staticCategory);
        }

        public async Task<StaticCategory> GetStaticCategory(int id)
        {
            return await GetByIdAsync(id);
        }
        public async Task<StaticCategoryDto> GetStaticCategoryWithParentName(int id)
        {
            var staticCategoryDto = _mapper.Map<StaticCategoryDto>(await GetStaticCategory(id));
            if (staticCategoryDto.ParentId.HasValue && staticCategoryDto.ParentId != 0)
            {
                staticCategoryDto.ParentName = (await GetStaticCategory(staticCategoryDto.ParentId.Value)).Title;
            }
            return staticCategoryDto;
        }

        public async Task<ApiSuccessResult<StaticCategoryDto>> GetStaticCategoryByPaging(StaticCategoryRequest staticCategoryRequest, params Expression<Func<StaticCategory, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(staticCategoryRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(staticCategoryRequest.Keyword)));
            }
            if (staticCategoryRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == staticCategoryRequest.Status.Value);
            }
            if (staticCategoryRequest.ParentId.HasValue)
            {
                query = query.Where(x => x.ParentId == staticCategoryRequest.ParentId.Value);
            }
            PagedResult<StaticCategory>? sourcePaging = await query.PaginatedListAsync(staticCategoryRequest.CurrentPage
                                                                                             ?? 1, staticCategoryRequest.PageSize ?? CommonConstants.PAGE_SIZE, staticCategoryRequest.OrderBy2ndColumn, staticCategoryRequest.Direction2ndColumn, staticCategoryRequest.OrderBy, staticCategoryRequest.Direction);
            var lstDto = _mapper.Map<List<StaticCategoryDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<StaticCategoryDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<StaticCategoryDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateStaticCategory(StaticCategory product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<StaticCategory>> GetStaticCategoryNormalByPaging(StaticCategoryRequest staticCategoryRequest, params Expression<Func<StaticCategory, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (staticCategoryRequest.Ids != null && staticCategoryRequest.Ids.Count > 0)
            {
                query = query.Where(x => staticCategoryRequest.Ids.Contains(x.Id));
            }

            PagedResult<StaticCategory>? sourcePaging = await query.PaginatedListAsync(staticCategoryRequest.CurrentPage
                                                                                              ?? 0, staticCategoryRequest.PageSize ?? 0, staticCategoryRequest.OrderBy, staticCategoryRequest.Direction);
            ApiSuccessResult<StaticCategory>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyStaticCategoryDto(List<int> lstStaticCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstStaticCategoryDto = (await GetStaticCategoryNormalByPaging(new StaticCategoryRequest()
            {
                Ids = lstStaticCategoryId
            })).PagedData.Results.ToList();
            Action<StaticCategory> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<StaticCategory>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstStaticCategoryDto.ForEach(action);
                await UpdateListAsync(lstStaticCategoryDto);
            }
        }
    }
}