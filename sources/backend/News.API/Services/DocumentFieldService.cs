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

    public class DocumentFieldService : RepositoryBase<DocumentField, int, NewsContext>, IDocumentFieldService
    {
        private readonly IMapper _mapper;
        public DocumentFieldService(IMapper mapper, NewsContext dbContext,
            IUnitOfWork<NewsContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task CreateDocumentField(DocumentField documentField)
        {
            await CreateAsync(documentField);
        }

        public async Task DeleteDocumentField(int id)
        {
            var documentField = await GetByIdAsync(id);
            await DeleteAsync(documentField);
        }
        public async Task<List<DocumentField>> GetAllDocumentFields()
        {
            return await FindAll().ToListAsync();
        }

        public async Task<DocumentField> GetDocumentField(int id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<ApiSuccessResult<DocumentFieldDto>> GetDocumentFieldByPaging(DocumentFieldRequest documentFieldRequest, params Expression<Func<DocumentField, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll(includeProperties: includeProperties);
            }

            if (!string.IsNullOrEmpty(documentFieldRequest.Keyword))
            {
                query = query.Where((x => x.Title.Contains(documentFieldRequest.Keyword)));
            }
            if (documentFieldRequest.Status.HasValue)
            {
                query = query.Where(x => x.Status == documentFieldRequest.Status.Value);
            }
            PagedResult<DocumentField>? sourcePaging = await query.PaginatedListAsync(documentFieldRequest.CurrentPage
                                                                                             ?? 1, documentFieldRequest.PageSize ?? CommonConstants.PAGE_SIZE, documentFieldRequest.OrderBy, documentFieldRequest.Direction);
            var lstDto = _mapper.Map<List<DocumentFieldDto>>(sourcePaging.Results);
            var paginationSet = new PagedResult<DocumentFieldDto>(lstDto, sourcePaging.RowCount, sourcePaging.CurrentPage, sourcePaging.PageSize);
            ApiSuccessResult<DocumentFieldDto>? result = new(paginationSet);
            return result;
        }

        public async Task UpdateDocumentField(DocumentField product)
        {
            await UpdateAsync(product);
        }

        public async Task<DocumentFieldDto> GetDocumentFieldWithParentName(int id)
        {
            var documentFieldDto = _mapper.Map<DocumentFieldDto>(await GetDocumentField(id));
            if (documentFieldDto.ParentId.HasValue && documentFieldDto.ParentId != 0)
            {
                documentFieldDto.ParentName = (await GetDocumentField(documentFieldDto.ParentId.Value)).Title;
            }
            return documentFieldDto;
        }

        public async Task<ApiSuccessResult<DocumentField>> GetDocumentFieldNormalByPaging(DocumentFieldRequest đocumentFieldRequest, params Expression<Func<DocumentField, object>>[] includeProperties)
        {
            var query = FindAll();
            if (includeProperties.ToList().Count > 0)
            {
                query = FindAll();
            }

            if (đocumentFieldRequest.Ids != null && đocumentFieldRequest.Ids.Count > 0)
            {
                query = query.Where(x => đocumentFieldRequest.Ids.Contains(x.Id));
            }

            if (đocumentFieldRequest.ParentId.HasValue)
            {
                query = query.Where(x => x.ParentId == đocumentFieldRequest.ParentId.Value);
            }
            PagedResult<DocumentField>? sourcePaging = await query.PaginatedListAsync(đocumentFieldRequest.CurrentPage
                                                                                              ?? 0, đocumentFieldRequest.PageSize ?? 0, đocumentFieldRequest.OrderBy2ndColumn, đocumentFieldRequest.Direction2ndColumn, đocumentFieldRequest.OrderBy, đocumentFieldRequest.Direction);
            ApiSuccessResult<DocumentField>? result = new(sourcePaging);
            return result;
        }

        public async Task UpdateManyDocumentFieldDto(List<int> lstDocumentFieldId, bool value, MultipleTypeUpdate multipleTypeUpdate)
        {
            var lstDocumentFieldDto = (await GetDocumentFieldNormalByPaging(new DocumentFieldRequest()
            {
                Ids = lstDocumentFieldId
            })).PagedData.Results.ToList();
            Action<DocumentField> action = null;
            switch (multipleTypeUpdate)
            {
                case MultipleTypeUpdate.STATUS:
                    action = new Action<DocumentField>(x => x.Status = value ? Status.Enabled : Status.Disabled);
                    break;
                default:
                    break;
            }
            if (action != null)
            {
                lstDocumentFieldDto.ForEach(action);
                await UpdateListAsync(lstDocumentFieldDto);
            }
        }
    }
}