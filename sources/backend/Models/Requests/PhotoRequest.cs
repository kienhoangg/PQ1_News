using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class PhotoRequest : FilterBase
    {
        public int? PhotoCategoryId { get; set; }
    }
}