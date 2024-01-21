using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class QuestionCategoryRequest : FilterBase
    {
        public int? ParentId { get; set; }
    }
}
