using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class MenuRequest : FilterBase
    {
        public int? ParentId { get; set; }
    }
}