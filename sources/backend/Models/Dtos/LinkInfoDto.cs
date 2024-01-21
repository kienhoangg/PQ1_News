using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class LinkInfoDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public LinkInfoCategoryDto? LinkInfoCategory { get; set; }
        public int? LinkInfoCategoryId { get; set; }
        public string? Avatar { get; set; }
        public string? Link { get; set; }
    }
}
