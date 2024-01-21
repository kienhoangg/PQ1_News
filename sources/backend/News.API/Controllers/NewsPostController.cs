using System.Collections.Generic;
using System.Collections.Immutable;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
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
    public class NewsPostController : ControllerBase
    {
        private readonly INewsPostService _newsPostService;


        private readonly ICategoryNewsService _categoryNewsService;

        private readonly ISerializeService _serializeService;

        private readonly IMapper _mapper;

        public NewsPostController(
            INewsPostService newsPostService,
            IMapper mapper,
            ISerializeService serializeService,
            ICategoryNewsService categoryNewsService
        )
        {
            _newsPostService = newsPostService;
            _mapper = mapper;
            _serializeService = serializeService;
            _categoryNewsService = categoryNewsService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetNewsPostByPaging([FromBody] NewsPostRequest newsPostRequest)
        {
            var lstInclude =
                new Expression<Func<NewsPost, object>>[] {
                    (x => x.FieldNews),
                    (x => x.SourceNews),
                    (x => x.CategoryNews),
                    (x=>x.Collaborator)
                };
            var result =
                await _newsPostService
                    .GetNewsPostByPaging(newsPostRequest, lstInclude);
            return Ok(result);
        }







        [HttpPost("file")]
        public async Task<IActionResult>
        FileUpload([FromForm] NewsPostUploadDto newsPostUploadDto)
        {
            string avartarPath = "";

            // Upload file avatar if exist
            if (newsPostUploadDto.Avatar != null)
            {
                avartarPath =
                    await newsPostUploadDto
                        .Avatar
                        .UploadFile(CommonConstants.IMAGES_PATH);
                return Ok(avartarPath);
            }
            return BadRequest();
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreateNewsPostDto([FromForm] NewsPostUploadDto newsPostUploadDto)
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
                    return BadRequest(new ApiErrorResult<NewsPost
                    >(lstErrorString));
                }
            }

            string avartarPath = "";
            string fileAttachmentPath = "";
            var newsPost =
                          _serializeService
                              .Deserialize<NewsPost>(newsPostUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                newsPost.Status = Status.Enabled;
            }
            // Upload file avatar if exist
            if (newsPostUploadDto.Avatar != null)
            {
                avartarPath =
                    await newsPostUploadDto
                        .Avatar
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }

            // Upload file attachment if exist
            if (newsPostUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await newsPostUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }
            newsPost.Avatar = avartarPath;
            newsPost.FilePath = fileAttachmentPath;
            await _newsPostService.CreateNewsPost(newsPost);
            var result = _mapper.Map<NewsPostDto>(newsPost);
            return Ok(result);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetNewsPostById([Required] long id)
        {
            var lstInclude =
               new Expression<Func<NewsPost, object>>[] {
                    (x => x.FieldNews),
                    (x => x.SourceNews),
                    (x => x.CategoryNews),
                    (x=>x.Collaborator)
               };
            NewsPost? newsPost = await _newsPostService.GetNewsPost(id, lstInclude);
            if (newsPost == null) return NotFound();

            var result = _mapper.Map<NewsPostDto>(newsPost);
            return Ok(result);
        }

        [HttpPut("")]
        public async Task<IActionResult>
       UpdateManyNewsPostDto(
         [FromBody] UpdateManyDto<long> newsPostUpdateManyDto
       )
        {
            //  var lstNewsPostId = strNewsPostId.Split(',').Select(long.Parse).ToList();
            await _newsPostService.UpdateManyNewsPostDto(newsPostUpdateManyDto.Ids, newsPostUpdateManyDto.Value.Value, newsPostUpdateManyDto.Field.Value);
            return NoContent();
        }

        [HttpPut("{id:long}")]
        public async Task<IActionResult>
        UpdateNewsPostDto(
            [Required] long id,
            [FromForm] NewsPostUploadDto newsPostUploadDto
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
                    return BadRequest(new ApiErrorResult<NewsPost
                    >(lstErrorString));
                }
            }
            NewsPost? newsPost = await _newsPostService.GetNewsPost(id);
            var tempAvatarPath = newsPost.Avatar;
            var tempFileAttachmentPath = newsPost.FilePath;
            if (newsPost == null) return NotFound();
            var newsPostUpdated = new NewsPost();
            if (!string.IsNullOrEmpty(newsPostUploadDto.JsonString))
            {
                newsPostUpdated =
                    _serializeService
                        .Deserialize<NewsPost>(newsPostUploadDto.JsonString);
                newsPostUpdated.Id = newsPost.Id;
                newsPostUpdated.CreatedDate = newsPost.CreatedDate;
            }
            string avartarPath = !String.IsNullOrEmpty(newsPostUpdated.Avatar) ? newsPostUpdated.Avatar : "";
            string fileAttachmentPath = !String.IsNullOrEmpty(newsPostUpdated.FilePath) ? newsPostUpdated.FilePath : "";

            // Upload file avatar if exist
            if (newsPostUploadDto.Avatar != null)
            {
                avartarPath =
                    await newsPostUploadDto
                        .Avatar
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }

            // Upload file attachment if exist
            if (newsPostUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await newsPostUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }


            newsPostUpdated.Avatar = avartarPath;
            newsPostUpdated.FilePath = fileAttachmentPath;
            var resultUpdate =
                await _newsPostService.UpdateNewsPost(newsPostUpdated);

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

            var result = _mapper.Map<NewsPostDto>(source: newsPostUpdated);
            return Ok(result);
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> DeleteNewsPostDto([Required] long id)
        {
            NewsPost? newsPost = await _newsPostService.GetNewsPost(id);
            if (newsPost == null) return NotFound();
            await _newsPostService.DeleteNewsPost(id);
            if (string.IsNullOrEmpty(newsPost.Avatar))
            {
                FileInfo fileFileAttachment =
                                              new FileInfo(Directory.GetCurrentDirectory() +
                                                  "/wwwroot" + newsPost.Avatar);
                if (fileFileAttachment.Exists)
                {
                    fileFileAttachment.Delete();
                }
            }

            if (string.IsNullOrEmpty(newsPost.FilePath))
            {
                FileInfo fileFileAttachment =
                                              new FileInfo(Directory.GetCurrentDirectory() +
                                                  "/wwwroot" + newsPost.FilePath);
                if (fileFileAttachment.Exists)
                {
                    fileFileAttachment.Delete();
                }
            }

            return NoContent();
        }
    }
}

