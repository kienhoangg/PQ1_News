using Contracts.Domains;

namespace Models.Entities
{
    public class Video : EntityAuditBase<int>
    {
        public string Title { get; set; }
        public int? VideoCategoryId { get; set; }
        public VideoCategory? VideoCategory { get; set; }
        public string? Avatar { get; set; }
        public string LinkVideo { get; set; }
        public string? FileAttachment { get; set; }

    }
}