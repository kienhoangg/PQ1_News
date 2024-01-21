using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IDocumentSignPersonService
    {
        Task<ApiSuccessResult<DocumentSignPersonDto>>
        GetDocumentSignPersonByPaging(

                DocumentSignPersonRequest documentSignPersonRequest,
                params Expression<Func<DocumentSignPerson, object>>[] includeProperties

        );

        Task<DocumentSignPerson> GetDocumentSignPerson(int id);

        Task CreateDocumentSignPerson(DocumentSignPerson documentSignPerson);

        Task UpdateDocumentSignPerson(DocumentSignPerson documentSignPerson);

        Task DeleteDocumentSignPerson(int id);
        Task<List<DocumentSignPerson>> GetAllDocumentSignPersons();
        Task UpdateManyDocumentSignPersonDto(List<int> lstDocumentSignPersonId, bool value, MultipleTypeUpdate multipleTypeUpdate);
        Task<DocumentSignPersonDto> GetDocumentSignPersonWithParentName(int id);
    }
}
