using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class VideoCategoryDto : DtoBase
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public ICollection<VideoDto> Videos { get; set; }
    }
}
