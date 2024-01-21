using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class VideoDto : DtoBase
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? VideoCategoryId { get; set; }
        public VideoCategoryDto? VideoCategory { get; set; }
        public string? Avatar { get; set; }
        public string LinkVideo { get; set; }
        public string? FileAttachment { get; set; }

    }
}
