using System;
using Infrastructure.Shared.SeedWork;

namespace Models.Requests
{
    public class VideoRequest : FilterBase
    {
        public int? VideoCategoryId { get; set; }
    }
}
