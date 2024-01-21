using Contracts.Domains;

namespace Models.Entities
{
    public class SourceNews : EntityAuditBase<int>
    {
        public string Title { get; set; }

        public string? Description { get; set; }

        public virtual ICollection<NewsPost> NewsPosts { get; set; }
    }
}
