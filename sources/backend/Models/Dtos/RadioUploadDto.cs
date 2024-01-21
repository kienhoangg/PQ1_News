using System;
using Contracts.Domains;
using Infrastructure.Shared.Attributes;
using Microsoft.AspNetCore.Http;

namespace Models.Dtos
{
    public class RadioUploadDto : UploadDtoBase
    {
        public int? Id { get; set; }

        [AllowedSize("err file size", 2 * 1024 * 1024)]
        public IFormFile? FileAttachment { get; set; }

    }
}
