using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class PublicInformationDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public PublicInformationCategoryDto? PublicInformationCategory { get; set; }
        public int? PublicInformationCategoryId { get; set; }
        public int? Year { get; set; }
        public string? FileAttachment { get; set; }
    }
}
