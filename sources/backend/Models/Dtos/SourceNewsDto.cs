using Contracts.Domains;

namespace Models.Dtos
{
    public class SourceNewsDto : DtoBase
    {
        public int Id { get; set; }

        public string Title { get; set; }


        public string? Description { get; set; }
    }
}
