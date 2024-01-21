using Contracts.Domains;

namespace Models.Entities
{
    public class VideoCategory : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public ICollection<Video> Videos { get; set; }
    }
}