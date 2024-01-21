using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class CompanyInfoDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public CompanyInfoCategoryDto? CompanyInfoCategory { get; set; }
        public int? CompanyInfoCategoryId { get; set; }
        public string? Avatar { get; set; }
        public string? Link { get; set; }
    }
}
