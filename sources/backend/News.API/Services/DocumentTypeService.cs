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

    public class DocumentTypeService : RepositoryBase<DocumentType, int, NewsContext>, IDocumentTypeService
    {
        private readonly IMapper _mapper;
        public DocumentTypeService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateDocumentType(DocumentType documentField)
        {
            await CreateAsync(documentField);
        }

        public async Task DeleteDocumentType(int id)
        {
            var documentField = await GetByIdAsync(id);
            await DeleteAsync(documentField);
        }

        public async Task<DocumentType> GetDocumentType(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<List<DocumentType>> GetAllDocumentTypes()
        {
            return await FindAll().ToListAsync();
        }

        public async Task<DocumentTypeDto> GetDocumentTypeWithParentName(int id)
        {
            var documentTypeDto = _mapper.Map<DocumentTypeDto>(await GetDocumentType(id));
            if (documentTypeDto.ParentId.HasValue && documentTypeDto.ParentId != 0)
            {
                documentTypeDto.ParentName = (await GetDocumentType(documentTypeDto.ParentId.Value)).Title;
            }
            return documentTypeDto;
        }

        public async Task<ApiSuccessResult<DocumentTypeDto>> GetDocumentTypeByPaging(DocumentTypeRequest documentTypeRequest, params Expression<Func<DocumentType, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(documentTypeRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(documentTypeRequest.Keyword)));
            }
            if (documentTypeRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == documentTypeRequest.Status.Value);
            }
            if (documentTypeRequest.ParentId.HasValue)
            {
                query = query.Where(x => x.ParentId == documentTypeRequest.ParentId.Value);
            }

            PagedResult<DocumentType>? sourcePaging = await query.PaginatedListAsync(documentTypeRequest.CurrentPage
                                                                                             ?? 1, documentTypeRequest.PageSize ?? CommonConstants.PAGE_SIZE, documentTypeRequest.OrderBy2ndColumn, documentTypeRequest.Direction2ndColumn, documentTypeRequest.OrderBy, documentTypeRequest.Direction);
            var lstDto = _mapper.Map<List<DocumentTypeDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<DocumentTypeDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<DocumentTypeDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateDocumentType(DocumentType product)
        {
            await UpdateAsync(product);
        }

        public async Task<ApiSuccessResult<DocumentType>> GetDocumentTypeNormalByPaging(DocumentTypeRequest documentTypeRequest, params Expression<Func<DocumentType, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (documentTypeRequest.Ids != null && documentTypeRequest.Ids.Count > 0)
            {
                query = query.Where(x => documentTypeRequest.Ids.Contains(x.Id));
            }

            PagedResult<DocumentType>? sourcePaging = await query.PaginatedListAsync(documentTypeRequest.CurrentPage
                                                                                              ?? 0, documentTypeRequest.PageSize ?? 0, documentTypeRequest.OrderBy, documentTypeRequest.Direction);
            ApiSuccessResult<DocumentType>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyDocumentTypeDto(List<int> lstDocumentTypeId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstDocumentTypeDto = (await GetDocumentTypeNormalByPaging(new DocumentTypeRequest()
            {
                Ids = lstDocumentTypeId
            })).PagedData.Results.ToList();
            Action<DocumentType> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<DocumentType>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstDocumentTypeDto.ForEach(action);
                await UpdateListAsync(lstDocumentTypeDto);
            }
        }
    }
}