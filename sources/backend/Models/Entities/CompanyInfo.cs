using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class CompanyInfo : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public CompanyInfoCategory? CompanyInfoCategory { get; set; }
        public int? CompanyInfoCategoryId { get; set; }
        public string? Avatar { get; set; }
        public string? Link { get; set; }
    }
}
