using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class PublicInformation : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public PublicInformationCategory? PublicInformationCategory { get; set; }
        public int? PublicInformationCategoryId { get; set; }
        public int? Year { get; set; }
        public string? FileAttachment { get; set; }
    }
}
