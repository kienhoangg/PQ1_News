using Contracts.Domains;
using Models.Entities;

namespace Models.Dtos
{
    public class DocumentDto : DtoBase
    {
        public long Id { get; set; }
        public string Code { get; set; }

        public string? Name { get; set; }

        public DateTime? PublishedDate { get; set; }

        public string? Content { get; set; }

        public DateTime? ExpiredDate { get; set; }

        public string? FilePath { get; set; }

        public DocumentDepartment? DocumentDepartment { get; set; }
        public DocumentField? DocumentField { get; set; }
        public DocumentSignPerson? DocumentSignPerson { get; set; }
        public DocumentType? DocumentType { get; set; }

        public int? DocumentDepartmentId { get; set; }
        public int? DocumentFieldId { get; set; }
        public int? DocumentSignPersonId { get; set; }
        public int? DocumentTypeId { get; set; }
        public bool IsDocumentSection { get; set; }
    }
}
