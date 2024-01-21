using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class RadioDto : DtoBase
    {
        public int? Id { get; set; }
        public string Title { get; set; }
        public string? FileAttachment { get; set; }
        public int? RadioCategoryId { get; set; }
        public RadioCategoryDto RadioCategory { get; set; }
    }
}
