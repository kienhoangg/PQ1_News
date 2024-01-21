using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Common.Enums;
using Common.Extensions;
using Common.Interfaces;
using Common.Shared.Constants;
using Infrastructure.Shared.SeedWork;
using Microsoft.AspNetCore.Mvc;
using Models.Constants;
using Models.Dtos;
using Models.Entities;
using Models.Requests;
using News.API.Authorization;
using News.API.Filter;
using News.API.Interfaces;

namespace News.API.Controllers
{
    [Authorize(RoleCode.ADMIN, RoleCode.SITE_ADMIN)]
    [Route("api/[controller]")]
    public class LinkInfosController : ControllerBase
    {
        private readonly ILinkInfoService _linkInfoService;
        private readonly ISerializeService _serializeService;
        private readonly IMapper _mapper;

        public LinkInfosController(
            ILinkInfoService linkInfoService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _linkInfoService = linkInfoService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetLinkInfoByPaging([FromBody] LinkInfoRequest linkInfoRequest)
        {
            var result =
                await _linkInfoService.GetLinkInfoByPaging(linkInfoRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
               CreateLinkInfoDto([FromForm] LinkInfoUploadDto linkInfoUploadDto)
        {
            if (!ModelState.IsValid)
            {
                // Cover case avatar extension not equal
                var lstError = ModelState.SelectMany(x => x.Value.Errors);
                if (lstError.Count() > 0)
                {
                    var lstErrorString = new List<string>();
                    foreach (var err in lstError)
                    {
                        lstErrorString.Add(err.ErrorMessage);
                    }
                    return BadRequest(new ApiErrorResult<LinkInfo
                    >(lstErrorString));
                }
            }
            string fileAttachmentPath = "";
            var linkInfo = _serializeService
                  .Deserialize<LinkInfo>(linkInfoUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                linkInfo.Status = Status.Enabled;
            }
            // Upload file attachment if exist
            if (linkInfoUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await linkInfoUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }
            linkInfo.Avatar = fileAttachmentPath;
            await _linkInfoService.CreateLinkInfo(linkInfo);

            var result = _mapper.Map<LinkInfoDto>(linkInfo);
            return Ok(result);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetLinkInfoById([Required] int id)
        {
            LinkInfo? linkInfo = await _linkInfoService.GetLinkInfo(id);
            if (linkInfo == null) return NotFound();

            var result = _mapper.Map<LinkInfoDto>(linkInfo);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
      UpdateLinkInfoDto(
          [Required] int id,
          [FromForm] LinkInfoUploadDto linkInfoUploadDto
      )
        {
            if (!ModelState.IsValid)
            {
                // Cover case avatar extension not equal
                var lstError = ModelState.SelectMany(x => x.Value.Errors);
                if (lstError.Count() > 0)
                {
                    var lstErrorString = new List<string>();
                    foreach (var err in lstError)
                    {
                        lstErrorString.Add(err.ErrorMessage);
                    }
                    return BadRequest(new ApiErrorResult<LinkInfo
                    >(lstErrorString));
                }
            }
            LinkInfo? linkInfo = await _linkInfoService.GetLinkInfo(id);
            if (linkInfo == null) return NotFound();
            var tempFileAttachmentPath = linkInfo.Avatar;
            var linkInfoUpdated = new LinkInfo();
            if (!string.IsNullOrEmpty(linkInfoUploadDto.JsonString))
            {
                linkInfoUpdated =
                    _serializeService
                        .Deserialize<LinkInfo>(linkInfoUploadDto.JsonString);
                linkInfoUpdated.Id = linkInfo.Id;
                linkInfoUpdated.CreatedDate = linkInfo.CreatedDate;
            }
            string fileAttachmentPath = !String.IsNullOrEmpty(linkInfoUpdated.Avatar) ? linkInfoUpdated.Avatar : "";
            // Upload file attachment if exist
            if (linkInfoUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await linkInfoUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }

            linkInfoUpdated.Avatar = fileAttachmentPath;
            await _linkInfoService.UpdateLinkInfo(linkInfoUpdated);

            if (fileAttachmentPath != tempFileAttachmentPath)
            {
                FileInfo fileFileAttachment =
                                     new FileInfo(Directory.GetCurrentDirectory() +
                                         "/wwwroot" + tempFileAttachmentPath);
                if (fileFileAttachment.Exists)
                {
                    fileFileAttachment.Delete();
                }
            }
            var result = _mapper.Map<LinkInfoDto>(source: linkInfoUpdated);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteLinkInfoDto([Required] int id)
        {
            LinkInfo? linkInfo = await _linkInfoService.GetLinkInfo(id);
            if (linkInfo == null) return NotFound();

            await _linkInfoService.DeleteLinkInfo(id);
            FileInfo fileFileAttachment =
                                    new FileInfo(Directory.GetCurrentDirectory() +
                                        linkInfo.Avatar);
            if (fileFileAttachment.Exists)
            {
                fileFileAttachment.Delete();
            }
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyLinkInfoDto(
    [FromBody] UpdateManyDto<int> linkInfoUpdateManyDto
  )
        {
            await _linkInfoService.UpdateManyLinkInfoDto(linkInfoUpdateManyDto.Ids, linkInfoUpdateManyDto.Value.Value, linkInfoUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
