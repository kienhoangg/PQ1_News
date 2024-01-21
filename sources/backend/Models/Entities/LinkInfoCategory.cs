using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class LinkInfoCategory : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public ICollection<LinkInfo> LinkInfos { get; set; }
    }
}
