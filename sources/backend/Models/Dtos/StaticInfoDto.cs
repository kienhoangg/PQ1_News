using Contracts.Domains;

namespace Models.Dtos
{
    public class StaticInfoDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string? Descritpion { get; set; }
        public string? Content { get; set; }
        public int? StaticCategoryId { get; set; }
        public StaticCategoryDto StaticCategory { get; set; }
        public string? FilePath { get; set; }
        public string? Avatar { get; set; }
    }
}