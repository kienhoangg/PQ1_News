using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class LinkInfo : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public LinkInfoCategory? LinkInfoCategory { get; set; }
        public int? LinkInfoCategoryId { get; set; }
        public string? Avatar { get; set; }
        public string? Link { get; set; }
    }
}
