using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class Menu : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public string? Url { get; set; }
        public int ParentId { get; set; }

    }
}

