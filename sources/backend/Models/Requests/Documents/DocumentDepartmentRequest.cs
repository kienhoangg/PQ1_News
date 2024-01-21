using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class DocumentDepartmentRequest : FilterBase
    {
        public int? ParentId { get; set; }
    }
}