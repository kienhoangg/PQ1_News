using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class CompanyInfoCategory : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public ICollection<CompanyInfo> CompanyInfos { get; set; }
    }
}
