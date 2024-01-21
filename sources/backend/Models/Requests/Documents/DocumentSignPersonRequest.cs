using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class DocumentSignPersonRequest : FilterBase
    {
        public int? ParentId { get; set; }
    }
}
