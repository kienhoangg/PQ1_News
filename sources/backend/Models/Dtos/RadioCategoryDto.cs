using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class RadioCategoryDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public ICollection<RadioDto> Radios { get; set; }
    }
}
