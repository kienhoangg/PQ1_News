using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class CategoryNewsRequest : FilterBase
    {
        public int? ParentId { get; set; }
    }
}
