using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class LinkInfoCategoryDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<LinkInfoDto> LinkInfos { get; set; }
    }
}
