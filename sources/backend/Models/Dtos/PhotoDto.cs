using Contracts.Domains;

namespace Models.Dtos
{
    public class PhotoDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public int? PhotoCategoryId { get; set; }
        public PhotoCategoryDto? PhotoCategory { get; set; }
        public string? ImagePath { get; set; }
    }
}