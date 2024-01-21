using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IDocumentFieldService
    {
        Task<ApiSuccessResult<DocumentFieldDto>>
        GetDocumentFieldByPaging(

                DocumentFieldRequest documentFieldRequest,
                params Expression<Func<DocumentField, object>>[] includeProperties

        );

        Task<DocumentField> GetDocumentField(int id);

        Task CreateDocumentField(DocumentField documentField);

        Task UpdateDocumentField(DocumentField documentField);

        Task DeleteDocumentField(int id);
        Task<List<DocumentField>> GetAllDocumentFields();

        Task UpdateManyDocumentFieldDto(List<int> lstDocumentFieldId, bool value, MultipleTypeUpdate multipleTypeUpdate);

        Task<DocumentFieldDto> GetDocumentFieldWithParentName(int id);
    }
}
