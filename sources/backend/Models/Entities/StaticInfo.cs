using Contracts.Domains;

namespace Models.Entities
{
    public class StaticInfo : EntityAuditBase<int>
    {
   
        public string Title { get; set; }
        public string? Descritpion { get; set; }
        public string? Content { get; set; }
        public int? StaticCategoryId { get; set; }
        public StaticCategory StaticCategory { get; set; }
        public string? FilePath { get; set; }
        public string? Avatar { get; set; }
    }
}