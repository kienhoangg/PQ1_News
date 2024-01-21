using Contracts.Domains;

namespace Models.Entities
{
    public class FieldNews : EntityAuditBase<int>
    {
        public string Title { get; set; }

        public string? Description { get; set; }

        public decimal Factor { get; set; }

        public decimal BiggestFactor { get; set; }
        public virtual ICollection<NewsPost> NewsPosts { get; set; }
    }
}
