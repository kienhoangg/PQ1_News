using System;
using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class PublicInformationRequest : FilterBase
    {
        public int? PublicInformationId { get; set; }
        public int? PublicInformationCategoryId { get; set; }
    }
}
