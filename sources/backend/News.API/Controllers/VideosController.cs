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
    public class VideosController : ControllerBase
    {
        private readonly IVideoService _videoService;

        private readonly ISerializeService _serializeService;

        private readonly IMapper _mapper;

        public VideosController(
            IVideoService videoService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _videoService = videoService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetVideoByPaging([FromBody] VideoRequest videoRequest)
        {
            var result =
                await _videoService.GetVideoByPaging(videoRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                  CreateVideoDto([FromForm] VideoUploadDto videoUploadDto)
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
                    return BadRequest(new ApiErrorResult<Video
                    >(lstErrorString));
                }
            }

            string avartarPath = "";
            string fileAttachmentPath = "";
            var video =
                          _serializeService
                              .Deserialize<Video>(videoUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                video.Status = Status.Enabled;
            }
            // Upload file avatar if exist
            if (videoUploadDto.Avatar != null)
            {
                avartarPath =
                    await videoUploadDto
                        .Avatar
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }

            // Upload file attachment if exist
            if (videoUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await videoUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }
            video.Avatar = avartarPath;
            video.FileAttachment = fileAttachmentPath;
            await _videoService.CreateVideo(video);
            var result = _mapper.Map<VideoDto>(video);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetVideoById([Required] int id)
        {
            Video? video = await _videoService.GetVideo(id);
            if (video == null) return NotFound();

            var result = _mapper.Map<VideoDto>(video);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
      UpdateVideoDto(
          [Required] int id,
          [FromForm] VideoUploadDto videoUploadDto
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
                    return BadRequest(new ApiErrorResult<Video
                    >(lstErrorString));
                }
            }
            Video? video = await _videoService.GetVideo(id);
            var tempAvatarPath = video.Avatar;
            var tempFileAttachmentPath = video.FileAttachment;
            if (video == null) return NotFound();
            var videoUpdated = new Video();
            if (!string.IsNullOrEmpty(videoUploadDto.JsonString))
            {
                videoUpdated =
                    _serializeService
                        .Deserialize<Video>(videoUploadDto.JsonString);
                videoUpdated.Id = video.Id;
                videoUpdated.CreatedDate = video.CreatedDate;
            }
            string avartarPath = !String.IsNullOrEmpty(videoUpdated.Avatar) ? videoUpdated.Avatar : "";
            string fileAttachmentPath = !String.IsNullOrEmpty(videoUpdated.FileAttachment) ? videoUpdated.FileAttachment : "";

            // Upload file avatar if exist
            if (videoUploadDto.Avatar != null)
            {
                avartarPath =
                    await videoUploadDto
                        .Avatar
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }

            // Upload file attachment if exist
            if (videoUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await videoUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }


            videoUpdated.Avatar = avartarPath;
            videoUpdated.FileAttachment = fileAttachmentPath;
            await _videoService.UpdateVideo(videoUpdated);

            if (avartarPath != tempAvatarPath)
            {
                FileInfo fileFileAttachment =
                                     new FileInfo(Directory.GetCurrentDirectory() +
                                         "/wwwroot" + tempAvatarPath);
                if (fileFileAttachment.Exists)
                {
                    fileFileAttachment.Delete();
                }
            }
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

            var result = _mapper.Map<VideoDto>(source: videoUpdated);
            return Ok(result);
        }



        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteVideoDto([Required] int id)
        {
            Video? video = await _videoService.GetVideo(id);
            if (video == null) return NotFound();
            await _videoService.DeleteVideo(id);
            if (string.IsNullOrEmpty(video.Avatar))
            {
                FileInfo fileFileAttachment =
                                              new FileInfo(Directory.GetCurrentDirectory() +
                                                  "/wwwroot" + video.Avatar);
                if (fileFileAttachment.Exists)
                {
                    fileFileAttachment.Delete();
                }
            }

            if (string.IsNullOrEmpty(video.FileAttachment))
            {
                FileInfo fileFileAttachment =
                                              new FileInfo(Directory.GetCurrentDirectory() +
                                                  "/wwwroot" + video.FileAttachment);
                if (fileFileAttachment.Exists)
                {
                    fileFileAttachment.Delete();
                }
            }

            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
 UpdateManyVideoDto(
   [FromBody] UpdateManyDto<int> videoUpdateManyDto
 )
        {
            await _videoService.UpdateManyVideoDto(videoUpdateManyDto.Ids, videoUpdateManyDto.Value.Value, videoUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
