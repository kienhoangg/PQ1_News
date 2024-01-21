using Contracts.Domains;
using Infrastructure.Shared.Attributes;
using Microsoft.AspNetCore.Http;

namespace Models.Dtos
{
    public class NewsPostUploadDto : UploadDtoBase
    {
        public long? Id { get; set; }

        [AllowedExtensions("err", new string[] { ".jpg", ".png", ".jpeg" })]
        public IFormFile? Avatar { get; set; }

        public IFormFile? FileAttachment { get; set; }

    }
}
