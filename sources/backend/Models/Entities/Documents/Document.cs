using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Contracts.Domains;

namespace Models.Entities
{
    public class Document : EntityAuditBase<long>
    {
        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public string Code { get; set; }
        [Column(TypeName = "nvarchar(250)")]
        public string? Name { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? PublishedDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? ExpiredDate { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? FilePath { get; set; }

        public string? Content { get; set; }
        public DocumentDepartment? DocumentDepartment { get; set; }
        public DocumentField? DocumentField { get; set; }
        public DocumentSignPerson? DocumentSignPerson { get; set; }
        public DocumentType? DocumentType { get; set; }

        public int? DocumentDepartmentId { get; set; }
        public int? DocumentFieldId { get; set; }
        public int? DocumentSignPersonId { get; set; }
        public int? DocumentTypeId { get; set; }

        [DefaultValue(false)]
        public bool IsDocumentSection { get; set; }
    }
}
