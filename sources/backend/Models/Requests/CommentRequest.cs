using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class CommentRequest : FilterBase
    {
        public int? CategoryNewsId { get; set; }
        public int? NewsPostId { get; set; }
    }
}
