using System;
using Contracts.Domains;
using Microsoft.AspNetCore.Http;

namespace Models.Dtos
{
    public class PublicInformationUploadDto : UploadDtoBase
    {
        public int? Id { get; set; }

        public List<IFormFile>? FileAttachment { get; set; }
    }
}
