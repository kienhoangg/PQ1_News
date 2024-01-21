using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class DocumentTypeRequest : FilterBase
    {
        public int? ParentId { get; set; }
    }
}