using Contracts.Domains;
using Models.Entities;

namespace Models.Dtos
{
    public class MenuDto : DtoBase
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Url { get; set; }
        public int? ParentId { get; set; }
        public int? IsLeaf { get; set; }
        public List<MenuDto> MenuChildren { get; set; }
    }
}