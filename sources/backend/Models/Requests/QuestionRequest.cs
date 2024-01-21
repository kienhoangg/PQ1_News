using Common.Enums;
using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class QuestionRequest : FilterBase
    {
        public int? QuestionCategoryId { get; set; }
    }
}
