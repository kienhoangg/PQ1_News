using Contracts.Domains;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace Models.Entities
{
    public class StaticCategory : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public int? ParentId { get; set; }
        public string? FilePath { get; set; }
        public ICollection<StaticInfo> Statics { get; set; }
    }
}