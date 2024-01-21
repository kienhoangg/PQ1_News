using Contracts.Domains;

namespace Models.Entities
{
    public class Collaborator : EntityAuditBase<int>
    {
        public string Name { get; set; }

        public string? Username { get; set; }

        public DateTime? BirthDate { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public bool IsAdmin { get; set; }

        public virtual ICollection<NewsPost> NewsPosts { get; set; }
    }
}
