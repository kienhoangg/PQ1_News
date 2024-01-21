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
    public class PublicInformationService : RepositoryBase<PublicInformation, int, NewsContext>, IPublicInformationService
    {
        private readonly IMapper _mapper;
        public PublicInformationService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreatePublicInformation(PublicInformation publicInformation)
        {
            await CreateAsync(publicInformation);
        }

        public async Task DeletePublicInformation(int id)
        {
            var publicInformation = await GetByIdAsync(id);
            await DeleteAsync(publicInformation);
        }

        public async Task<PublicInformation> GetPublicInformation(int id)
        {
            return await GetByIdAsync(id, includeProperties: x => x.PublicInformationCategory);
        }



        public async Task<ApiSuccessResult<PublicInformationDto>> GetPublicInformationByPaging(PublicInformationRequest publicInformationRequest, params Expression<Func<PublicInformation, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(publicInformationRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(publicInformationRequest.Keyword)));
            }
            if (publicInformationRequest.PublicInformationId.HasValue)
            {
                query = query.Where(x => x.Id == publicInformationRequest.PublicInformationId.Value);
            }
            if (publicInformationRequest.PublicInformationCategoryId.HasValue)
            {
                query = query.Where(x => x.PublicInformationCategoryId == publicInformationRequest.PublicInformationCategoryId.Value);
            }
            if (publicInformationRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == publicInformationRequest.Status.Value);
            }
            PagedResult<PublicInformation>? sourcePaging = await query.PaginatedListAsync(publicInformationRequest.CurrentPage
                                                                                             ?? 1, publicInformationRequest.PageSize ?? CommonConstants.PAGE_SIZE, publicInformationRequest.OrderBy2ndColumn, publicInformationRequest.Direction2ndColumn, publicInformationRequest.OrderBy, publicInformationRequest.Direction);
            var lstDto = _mapper.Map<List<PublicInformationDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<PublicInformationDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<PublicInformationDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdatePublicInformation(PublicInformation product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<PublicInformation>> GetPublicInformationNormalByPaging(PublicInformationRequest publicInformationRequest, params Expression<Func<PublicInformation, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (publicInformationRequest.Ids != null && publicInformationRequest.Ids.Count > 0)
            {
                query = query.Where(x => publicInformationRequest.Ids.Contains(x.Id));
            }

            PagedResult<PublicInformation>? sourcePaging = await query.PaginatedListAsync(publicInformationRequest.CurrentPage
                                                                                              ?? 0, publicInformationRequest.PageSize ?? 0, publicInformationRequest.OrderBy, publicInformationRequest.Direction);
            ApiSuccessResult<PublicInformation>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyPublicInformationDto(List<int> lstPublicInformationId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstPublicInformationDto = (await GetPublicInformationNormalByPaging(new PublicInformationRequest()
            {
                Ids = lstPublicInformationId
            })).PagedData.Results.ToList();
            Action<PublicInformation> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<PublicInformation>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstPublicInformationDto.ForEach(action);
                await UpdateListAsync(lstPublicInformationDto);
            }
        }
    }
}