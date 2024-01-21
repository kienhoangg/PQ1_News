using System;
using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class RadioRequest : FilterBase
    {
        public int? RadioCategoryId { get; set; }
    }
}
