using System.Collections;
using Contracts.Domains;

namespace Models.Entities
{
    public class PhotoCategory : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public int? ParentId { get; set; }
        public string? Description { get; set; }
        public string? FilePath { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}