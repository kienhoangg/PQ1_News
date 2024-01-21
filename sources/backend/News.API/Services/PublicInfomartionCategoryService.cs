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
    public class PublicInformationCategoryService : RepositoryBase<PublicInformationCategory, int, NewsContext>, IPublicInformationCategoryService
    {
        private readonly IMapper _mapper;
        public PublicInformationCategoryService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreatePublicInformationCategory(PublicInformationCategory publicInformationCategory)
        {
            await CreateAsync(publicInformationCategory);
        }

        public async Task DeletePublicInformationCategory(int id)
        {
            var publicInformationCategory = await GetByIdAsync(id);
            await DeleteAsync(publicInformationCategory);
        }

        public async Task<List<PublicInformationCategory>> GetPublicInformationByCategory(PublicInformationCategoryRequest publicInformationCategoryRequest)
        {
            IQueryable<PublicInformationCategory> query = FindAll(includeProperties: x => x.PublicInformations);
            var currentPage = publicInformationCategoryRequest.CurrentPage.HasValue ? publicInformationCategoryRequest.CurrentPage.Value : 1;
            var pageSize = publicInformationCategoryRequest.PageSize.HasValue ? publicInformationCategoryRequest.PageSize.Value : 5;
            var result = query
            .Skip((currentPage - 1) * pageSize)
                                   .Take(pageSize).OrderBy(x => x.Order)
                        .Select(a => new { a, PublicInformations = a.PublicInformations.Skip(0).Take(5).ToList() })
                        .AsEnumerable()
                        .Select(x =>
                        {
                            x.a.PublicInformations = x.PublicInformations;
                            return x.a;
                        }).ToList();

            return result;
        }

        public async Task<PublicInformationCategory> GetPublicInformationCategory(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<PublicInformationCategoryDto>> GetPublicInformationCategoryByPaging(PublicInformationCategoryRequest publicInformationCategoryRequest, params Expression<Func<PublicInformationCategory, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(publicInformationCategoryRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(publicInformationCategoryRequest.Keyword)));
            }
            if (publicInformationCategoryRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == publicInformationCategoryRequest.Status.Value);
            }
            PagedResult<PublicInformationCategory>? sourcePaging = await query.PaginatedListAsync(publicInformationCategoryRequest.CurrentPage
                                                                                             ?? 1, publicInformationCategoryRequest.PageSize ?? CommonConstants.PAGE_SIZE, publicInformationCategoryRequest.OrderBy2ndColumn, publicInformationCategoryRequest.Direction2ndColumn, publicInformationCategoryRequest.OrderBy, publicInformationCategoryRequest.Direction);
            var lstDto = _mapper.Map<List<PublicInformationCategoryDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<PublicInformationCategoryDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<PublicInformationCategoryDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdatePublicInformationCategory(PublicInformationCategory product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<PublicInformationCategory>> GetPublicInformationCategoryNormalByPaging(PublicInformationCategoryRequest publicInformationCategoryRequest, params Expression<Func<PublicInformationCategory, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (publicInformationCategoryRequest.Ids != null && publicInformationCategoryRequest.Ids.Count > 0)
            {
                query = query.Where(x => publicInformationCategoryRequest.Ids.Contains(x.Id));
            }

            PagedResult<PublicInformationCategory>? sourcePaging = await query.PaginatedListAsync(publicInformationCategoryRequest.CurrentPage
                                                                                              ?? 0, publicInformationCategoryRequest.PageSize ?? 0, publicInformationCategoryRequest.OrderBy, publicInformationCategoryRequest.Direction);
            ApiSuccessResult<PublicInformationCategory>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyPublicInformationCategoryDto(List<int> lstPublicInformationCategoryId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstPublicInformationCategoryDto = (await GetPublicInformationCategoryNormalByPaging(new PublicInformationCategoryRequest()
            {
                Ids = lstPublicInformationCategoryId
            })).PagedData.Results.ToList();
            Action<PublicInformationCategory> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<PublicInformationCategory>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstPublicInformationCategoryDto.ForEach(action);
                await UpdateListAsync(lstPublicInformationCategoryDto);
            }
        }
    }
}