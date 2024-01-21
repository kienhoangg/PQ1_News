using System.Linq.Expressions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public class CollaboratorService : RepositoryBase<Collaborator, int, NewsContext>, ICollaboratorService
    {
        private readonly IMapper _mapper;
        public CollaboratorService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateCollaborator(Collaborator collaborator)
        {
            await CreateAsync(collaborator);
        }

        public async Task DeleteCollaborator(int id)
        {
            var collaborator = await GetByIdAsync(id);
            await DeleteAsync(collaborator);
        }

        public async Task<Collaborator> GetCollaborator(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<CollaboratorDto>> GetCollaboratorByPaging(CollaboratorRequest collaboratorRequest, params Expression<Func<Collaborator, object>>[] includeProperties)
        {
            var query = FindAll();

            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(collaboratorRequest.Keyword))
            {
                query = FindByCondition((x => x.Name.Contains(collaboratorRequest.Keyword)));
            }
            if (collaboratorRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == collaboratorRequest.Status.Value);
            }
            PagedResult<Collaborator>? sourcePaging = await query.PaginatedListAsync(collaboratorRequest.CurrentPage
                                                                                             ?? 1, collaboratorRequest.PageSize ?? CommonConstants.PAGE_SIZE, collaboratorRequest.OrderBy2ndColumn, collaboratorRequest.Direction2ndColumn, collaboratorRequest.OrderBy, collaboratorRequest.Direction);
            var lstDto = _mapper.Map<List<CollaboratorDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<CollaboratorDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<CollaboratorDto>? result = new(paginationSet);
            return result;
        }


        public async Task UpdateCollaborator(Collaborator product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<Collaborator>> GetCollaboratorNormalByPaging(CollaboratorRequest collaboratorRequest, params Expression<Func<Collaborator, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (collaboratorRequest.Ids != null && collaboratorRequest.Ids.Count > 0)
            {
                query = query.Where(x => collaboratorRequest.Ids.Contains(x.Id));
            }

            PagedResult<Collaborator>? sourcePaging = await query.PaginatedListAsync(collaboratorRequest.CurrentPage
                                                                                              ?? 0, collaboratorRequest.PageSize ?? 0, collaboratorRequest.OrderBy, collaboratorRequest.Direction);
            ApiSuccessResult<Collaborator>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyCollaboratorDto(List<int> lstCollaboratorId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstCollaboratorDto = (await GetCollaboratorNormalByPaging(new CollaboratorRequest()
            {
                Ids = lstCollaboratorId
            })).PagedData.Results.ToList();
            Action<Collaborator> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<Collaborator>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstCollaboratorDto.ForEach(action);
                await UpdateListAsync(lstCollaboratorDto);
            }
        }
    }
}