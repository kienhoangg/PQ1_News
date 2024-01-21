using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class RadioCategory : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public ICollection<Radio> Radios { get; set; }
    }
}
