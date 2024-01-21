using Contracts.Domains;

namespace Models.Dtos
{
    public class FieldNewsDto : DtoBase
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string? Description { get; set; }

        public decimal Factor { get; set; }

        public decimal BiggestFactor { get; set; }

        public ICollection<NewsPostDto> NewsPosts { get; set; }
    }
}
