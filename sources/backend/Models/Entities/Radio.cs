using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class Radio : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public string? FileAttachment { get; set; }
        public int? RadioCategoryId { get; set; }
        public RadioCategory RadioCategory { get; set; }
    }
}
