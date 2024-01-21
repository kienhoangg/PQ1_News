using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IDocumentService
    {
        Task<ApiSuccessResult<DocumentDto>>
        GetDocumentByPaging(

                DocumentRequest documentFieldRequest,
                params Expression<Func<Document, object>>[] includeProperties

        );

        Task<Document> GetDocument(int id, params Expression<Func<Document, object>>[] includeProperties);

        Task CreateDocument(Document documentField);

        Task<int> UpdateDocument(Document documentField);

        Task DeleteDocument(int id);
        Task<DocumentsMasterDataDto> GetMasterDataDocument();

        Task UpdateManyDocumentDto(List<int> lstDocumentId, bool value, MultipleTypeUpdate multipleTypeUpdate);
    }
}
