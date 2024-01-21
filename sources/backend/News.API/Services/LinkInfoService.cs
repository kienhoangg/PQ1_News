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
    public class LinkInfoService : RepositoryBase<LinkInfo, int, NewsContext>, ILinkInfoService
    {
        private readonly IMapper _mapper;
        public LinkInfoService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateLinkInfo(LinkInfo linkInfo)
        {
            await CreateAsync(linkInfo);
        }

        public async Task DeleteLinkInfo(int id)
        {
            var linkInfo = await GetByIdAsync(id);
            await DeleteAsync(linkInfo);
        }

        public async Task<LinkInfo> GetLinkInfo(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<LinkInfoDto>> GetLinkInfoByPaging(LinkInfoRequest linkInfoRequest, params Expression<Func<LinkInfo, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(linkInfoRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(linkInfoRequest.Keyword)));
            }
            if (linkInfoRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == linkInfoRequest.Status.Value);
            }
            PagedResult<LinkInfo>? sourcePaging = await query.PaginatedListAsync(linkInfoRequest.CurrentPage
                                                                                             ?? 1, linkInfoRequest.PageSize ?? CommonConstants.PAGE_SIZE, linkInfoRequest.OrderBy2ndColumn, linkInfoRequest.Direction2ndColumn, linkInfoRequest.OrderBy, linkInfoRequest.Direction);
            var lstDto = _mapper.Map<List<LinkInfoDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<LinkInfoDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<LinkInfoDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateLinkInfo(LinkInfo product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<LinkInfo>> GetLinkInfoNormalByPaging(LinkInfoRequest linkInfoRequest, params Expression<Func<LinkInfo, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (linkInfoRequest.Ids != null && linkInfoRequest.Ids.Count > 0)
            {
                query = query.Where(x => linkInfoRequest.Ids.Contains(x.Id));
            }
            PagedResult<LinkInfo>? sourcePaging = await query.PaginatedListAsync(linkInfoRequest.CurrentPage
                                                                                              ?? 0, linkInfoRequest.PageSize ?? 0, linkInfoRequest.OrderBy, linkInfoRequest.Direction);
            ApiSuccessResult<LinkInfo>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyLinkInfoDto(List<int> lstLinkInfoId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstLinkInfoDto = (await GetLinkInfoNormalByPaging(new LinkInfoRequest()
            {
                Ids = lstLinkInfoId
            })).PagedData.Results.ToList();
            Action<LinkInfo> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<LinkInfo>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstLinkInfoDto.ForEach(action);
                await UpdateListAsync(lstLinkInfoDto);
            }
        }
    }
}