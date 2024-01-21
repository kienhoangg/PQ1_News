using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class PhotoCategoryRequest : FilterBase
    {
        public int? ParentId { get; set; }
    }
}