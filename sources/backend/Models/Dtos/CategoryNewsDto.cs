using Contracts.Domains;

namespace Models.Dtos
{
    public class CategoryNewsDto : DtoBase
    {
        public int Id { get; set; }
        public string CategoryNewsName { get; set; }
        public int? ParentId { get; set; }
        public string ParentName { get; set; }
        public string? Keyword { get; set; }
        public int? FieldNews_SK_FK { get; set; }
        public FieldNewsDto? FieldNews { get; set; }
        public List<NewsPostDto>? NewsPosts { get; set; }
    }
}
