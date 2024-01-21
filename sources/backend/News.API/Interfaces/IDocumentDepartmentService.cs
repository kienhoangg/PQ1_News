using System.Linq.Expressions;
using Common.Enums;
using Infrastructure.Shared.SeedWork;
using Models.Dtos;
using Models.Entities;
using Models.Requests;

namespace News.API.Interfaces
{
    public interface IDocumentDepartmentService
    {
        Task<ApiSuccessResult<DocumentDepartmentDto>>
        GetDocumentDepartmentByPaging(

                DocumentDepartmentRequest documentDepartmentRequest,
                params Expression<Func<DocumentDepartment, object>>[] includeProperties

        );

        Task<DocumentDepartment> GetDocumentDepartment(int id);

        Task CreateDocumentDepartment(DocumentDepartment documentType);

        Task UpdateDocumentDepartment(DocumentDepartment documentType);

        Task DeleteDocumentDepartment(int id);
        Task<List<DocumentDepartment>> GetAllDocumentDepartments();
        Task UpdateManyDocumentDepartmentDto(List<int> lstDocumentDepartmentId, bool value, MultipleTypeUpdate multipleTypeUpdate);
        Task<DocumentDepartmentDto> GetDocumentDepartmentWithParentName(int id);
    }
}
