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
    public class LinkInfoCategoryService : RepositoryBase<LinkInfoCategory, int, NewsContext>, ILinkInfoCategoryService
    {
        private readonly IMapper _mapper;
        public LinkInfoCategoryService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateLinkInfoCategory(LinkInfoCategory linkInfoCategory)
        {
            await CreateAsync(linkInfoCategory);
        }

        public async Task DeleteLinkInfoCategory(int id)
        {
            var linkInfoCategory = await GetByIdAsync(id);
            await DeleteAsync(linkInfoCategory);
        }

        public async Task<LinkInfoCategory> GetLinkInfoCategory(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<LinkInfoCategoryDto>> GetLinkInfoCategoryByPaging(LinkInfoCategoryRequest linkInfoCategoryRequest, params Expression<Func<LinkInfoCategory, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(linkInfoCategoryRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(linkInfoCategoryRequest.Keyword)));
            }
            if (linkInfoCategoryRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == linkInfoCategoryRequest.Status.Value);
            }
            PagedResult<LinkInfoCategory>? sourcePaging = await query.PaginatedListAsync(linkInfoCategoryRequest.CurrentPage
                                                                                             ?? 1, linkInfoCategoryRequest.PageSize ?? CommonConstants.PAGE_SIZE, linkInfoCategoryRequest.OrderBy2ndColumn, linkInfoCategoryRequest.Direction2ndColumn, linkInfoCategoryRequest.OrderBy, linkInfoCategoryRequest.Direction);
            var lstDto = _mapper.Map<List<LinkInfoCategoryDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<LinkInfoCategoryDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<LinkInfoCategoryDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateLinkInfoCategory(LinkInfoCategory product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<LinkInfoCategory>> GetLinkInfoCategoryNormalByPaging(LinkInfoCategoryRequest linkInfoCategoryRequest, params Expression<Func<LinkInfoCategory, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (linkInfoCategoryRequest.Ids != null && linkInfoCategoryRequest.Ids.Count > 0)
            {
                query = query.Where(x => linkInfoCategoryRequest.Ids.Contains(x.Id));
            }

            PagedResult<LinkInfoCategory>? sourcePaging = await query.PaginatedListAsync(linkInfoCategoryRequest.CurrentPage
                                                                                              ?? 0, linkInfoCategoryRequest.PageSize ?? 0, linkInfoCategoryRequest.OrderBy, linkInfoCategoryRequest.Direction);
            ApiSuccessResult<LinkInfoCategory>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyLinkInfoCategoryDto(List<int> lstLinkInfoCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstLinkInfoCategoryDto = (await GetLinkInfoCategoryNormalByPaging(new LinkInfoCategoryRequest()
            {
                Ids = lstLinkInfoCategoryId
            })).PagedData.Results.ToList();
            Action<LinkInfoCategory> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<LinkInfoCategory>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstLinkInfoCategoryDto.ForEach(action);
                await UpdateListAsync(lstLinkInfoCategoryDto);
            }
        }
    }
}