using System;
using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class NewsPostRequest : FilterBase
    {
        public bool? IsHotNews { get; set; }
        public bool? IsDocumentNews { get; set; }
        public int? CategoryNewsId { get; set; }
        public string CategoryNewsName { get; set; }
        public int? SourceNewsId { get; set; }

        public int? CollaboratorId { get; set; }

        public int? FieldNewsId { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public DateTime? TodayDate { get; set; }
        public List<long> ListNewsPostId { get; set; }
    }
}
