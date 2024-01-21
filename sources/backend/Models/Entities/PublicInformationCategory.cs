using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class PublicInformationCategory : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public ICollection<PublicInformation> PublicInformations { get; set; }
    }
}
