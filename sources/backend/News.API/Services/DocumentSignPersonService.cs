using System.Linq.Expressions;
using AutoMapper;
using Common.Enums;
using Common.Interfaces;
using Infrastructure.Implements;
using Infrastructure.Mappings;
using Infrastructure.Shared.Paging;
using Infrastructure.Shared.SeedWork;
using Microsoft.EntityFrameworkCore;
using Models.Constants;
using Models.Dtos;
using Models.Entities;
using Models.Requests;
using News.API.Interfaces;
using News.API.Persistence;

namespace News.API.Services
{

    public class DocumentSignPersonService : RepositoryBase<DocumentSignPerson, int, NewsContext>, IDocumentSignPersonService
    {
        private readonly IMapper _mapper;
        public DocumentSignPersonService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateDocumentSignPerson(DocumentSignPerson documentSignPerson)
        {
            await CreateAsync(documentSignPerson);
        }

        public async Task DeleteDocumentSignPerson(int id)
        {
            var documentSignPerson = await GetByIdAsync(id);
            await DeleteAsync(documentSignPerson);
        }

        public async Task<DocumentSignPerson> GetDocumentSignPerson(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<List<DocumentSignPerson>> GetAllDocumentSignPersons()
        {
            return await FindAll().ToListAsync();
        }

        public async Task<DocumentSignPersonDto> GetDocumentSignPersonWithParentName(int id)
        {
            var documentSignPersonDto = _mapper.Map<DocumentSignPersonDto>(await GetDocumentSignPerson(id));
            if (documentSignPersonDto.ParentId.HasValue && documentSignPersonDto.ParentId != 0)
            {
                documentSignPersonDto.ParentName = (await GetDocumentSignPerson(documentSignPersonDto.ParentId.Value)).Title;
            }
            return documentSignPersonDto;
        }

        public async Task<ApiSuccessResult<DocumentSignPersonDto>> GetDocumentSignPersonByPaging(DocumentSignPersonRequest documentSignPersonRequest, params Expression<Func<DocumentSignPerson, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(documentSignPersonRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(documentSignPersonRequest.Keyword)));
            }
            if (documentSignPersonRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == documentSignPersonRequest.Status.Value);
            }
            if (documentSignPersonRequest.ParentId.HasValue)
            {
                query = query.Where(x => x.ParentId == documentSignPersonRequest.ParentId.Value);
            }
            PagedResult<DocumentSignPerson>? sourcePaging = await query.PaginatedListAsync(documentSignPersonRequest.CurrentPage
                                                                                             ?? 1, documentSignPersonRequest.PageSize ?? CommonConstants.PAGE_SIZE, documentSignPersonRequest.OrderBy2ndColumn, documentSignPersonRequest.Direction2ndColumn, documentSignPersonRequest.OrderBy, documentSignPersonRequest.Direction);
            var lstDto = _mapper.Map<List<DocumentSignPersonDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<DocumentSignPersonDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<DocumentSignPersonDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateDocumentSignPerson(DocumentSignPerson product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<DocumentSignPerson>> GetDocumentSignPersonNormalByPaging(DocumentSignPersonRequest documentSignPersonRequest, params Expression<Func<DocumentSignPerson, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (documentSignPersonRequest.Ids != null && documentSignPersonRequest.Ids.Count > 0)
            {
                query = query.Where(x => documentSignPersonRequest.Ids.Contains(x.Id));
            }
            PagedResult<DocumentSignPerson>? sourcePaging = await query.PaginatedListAsync(documentSignPersonRequest.CurrentPage
                                                                                              ?? 0, documentSignPersonRequest.PageSize ?? 0, documentSignPersonRequest.OrderBy, documentSignPersonRequest.Direction);
            ApiSuccessResult<DocumentSignPerson>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyDocumentSignPersonDto(List<int> lstDocumentSignPersonId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstDocumentSignPersonDto = (await GetDocumentSignPersonNormalByPaging(new DocumentSignPersonRequest()
            {
                Ids = lstDocumentSignPersonId
            })).PagedData.Results.ToList();
            Action<DocumentSignPerson> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<DocumentSignPerson>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstDocumentSignPersonDto.ForEach(action);
                await UpdateListAsync(lstDocumentSignPersonDto);
            }
        }
    }
}