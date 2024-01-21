using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class CompanyInfoCategoryDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<CompanyInfoDto> CompanyInfos { get; set; }
    }
}
