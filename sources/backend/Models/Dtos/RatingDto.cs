using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class RatingDto : DtoBase
    {
        public int Id { get; set; }
        public string Title { get; set; }
    }
}
