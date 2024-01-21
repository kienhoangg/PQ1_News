using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class DocumentFieldRequest : FilterBase
    {
        public int? ParentId { get; set; }
    }
}