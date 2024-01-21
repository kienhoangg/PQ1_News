using Common.Enums;
using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class StaticCategoryRequest : FilterBase
    {
        public int? ParentId { get; set; }
    }
}
