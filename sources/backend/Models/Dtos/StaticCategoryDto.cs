using Contracts.Domains;

namespace Models.Dtos
{
    public class StaticCategoryDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public int? ParentId { get; set; }
        public string ParentName { get; set; }
        public string? FilePath { get; set; }
        public ICollection<StaticInfoDto> Statics { get; set; }

    }
}