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
    public class StaticInfosController : ControllerBase
    {
        private readonly IStaticInfoService _staticInfoService;
        private readonly ISerializeService _serializeService;
        private readonly IMapper _mapper;

        public StaticInfosController(
            IStaticInfoService staticInfoService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _staticInfoService = staticInfoService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetStaticInfoByPaging([FromBody] StaticInfoRequest staticInfoRequest)
        {
            var result =
                await _staticInfoService.GetStaticInfoByPaging(staticInfoRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
               CreateStaticInfoDto([FromForm] StaticInfoUploadDto staticInfoUploadDto)
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
                    return BadRequest(new ApiErrorResult<StaticInfo
                    >(lstErrorString));
                }
            }

            string avartarPath = "";
            string fileAttachmentPath = "";

            // Upload file avatar if exist
            if (staticInfoUploadDto.Avatar != null)
            {
                avartarPath =
                    await staticInfoUploadDto
                        .Avatar
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }

            // Upload file attachment if exist
            if (staticInfoUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await staticInfoUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }

            var staticInfo =
                _serializeService
                    .Deserialize<StaticInfo>(staticInfoUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                staticInfo.Status = Status.Enabled;
            }

            staticInfo.Avatar = avartarPath;
            staticInfo.FilePath = fileAttachmentPath;
            await _staticInfoService.CreateStaticInfo(staticInfo);
            var result = _mapper.Map<StaticInfoDto>(staticInfo);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetStaticInfoById([Required] int id)
        {
            StaticInfo? staticInfo = await _staticInfoService.GetStaticInfo(id);
            if (staticInfo == null) return NotFound();

            var result = _mapper.Map<StaticInfoDto>(staticInfo);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateStaticInfoDto(
            [Required] int id,
            [FromForm] StaticInfoUploadDto staticInfoUploadDto
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
                    return BadRequest(new ApiErrorResult<StaticInfo
                    >(lstErrorString));
                }
            }
            StaticInfo? staticInfo = await _staticInfoService.GetStaticInfo(id);
            var tempAvatarPath = staticInfo.Avatar;
            var tempFileAttachmentPath = staticInfo.FilePath;
            if (staticInfo == null) return NotFound();
            var staticInfoDto = new StaticInfoDto();
            if (!string.IsNullOrEmpty(staticInfoUploadDto.JsonString))
            {
                staticInfoDto =
                    _serializeService
                        .Deserialize<StaticInfoDto>(staticInfoUploadDto.JsonString);
                staticInfoDto.Id = staticInfo.Id;
                staticInfoDto.CreatedDate = staticInfo.CreatedDate;
            }
            string avartarPath = "";
            string fileAttachmentPath = "";

            // Upload file avatar if exist
            if (staticInfoUploadDto.Avatar != null)
            {
                avartarPath =
                    await staticInfoUploadDto
                        .Avatar
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }

            // Upload file attachment if exist
            if (staticInfoUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await staticInfoUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }

            var updatedStaticInfo = _mapper.Map(staticInfoDto, staticInfo);
            updatedStaticInfo.Avatar = avartarPath;
            updatedStaticInfo.FilePath = fileAttachmentPath;
            var resultUpdate =
                await _staticInfoService.UpdateStaticInfo(updatedStaticInfo);

            if (resultUpdate > 0)
            {
                FileInfo fileAvatar =
                    new FileInfo(Directory.GetCurrentDirectory() +
                        tempAvatarPath);
                FileInfo fileFileAttachment =
                    new FileInfo(Directory.GetCurrentDirectory() +
                        tempFileAttachmentPath);

                // Clear old file upload if update success
                if (fileAvatar.Exists)
                {
                    fileAvatar.Delete();
                }
                if (fileFileAttachment.Exists)
                {
                    fileFileAttachment.Delete();
                }
            }
            var result = _mapper.Map<StaticInfoDto>(source: updatedStaticInfo);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteStaticInfoDto([Required] int id)
        {
            StaticInfo? staticInfo = await _staticInfoService.GetStaticInfo(id);
            if (staticInfo == null) return NotFound();

            await _staticInfoService.DeleteStaticInfo(id);
            return NoContent();
        }
        [HttpPut("")]
        public async Task<IActionResult>
 UpdateManyStaticInfoDto(
   [FromBody] UpdateManyDto<int> staticInfoUpdateManyDto
 )
        {
            await _staticInfoService.UpdateManyStaticInfoDto(staticInfoUpdateManyDto.Ids, staticInfoUpdateManyDto.Value.Value, staticInfoUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
