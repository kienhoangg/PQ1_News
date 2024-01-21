using Contracts.Domains;

namespace Models.Entities
{
    public class Photo : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public int? PhotoCategoryId { get; set; }
        public PhotoCategory? PhotoCategory { get; set; }
        public string? ImagePath { get; set; }
    }
}