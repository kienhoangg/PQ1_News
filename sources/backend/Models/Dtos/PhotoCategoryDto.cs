using Contracts.Domains;

namespace Models.Dtos
{
    public class PhotoCategoryDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public int? ParentId { get; set; }
        public string ParentName { get; set; }
        public string? Description { get; set; }
        public string? Avatar { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
    }
}