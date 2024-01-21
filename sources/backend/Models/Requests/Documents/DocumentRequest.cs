using System;
using Infrastructure.Shared.SeedWork;
using Models.Entities;

namespace Models.Requests
{
    public class DocumentRequest : FilterBase
    {
        public string? Title { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? DocumentDepartmentId { get; set; }
        public int? DocumentFieldId { get; set; }
        public int? DocumentSignPersonId { get; set; }
        public int? DocumentTypeId { get; set; }
        public bool? IsDocumentSection { get; set; }

    }
}

