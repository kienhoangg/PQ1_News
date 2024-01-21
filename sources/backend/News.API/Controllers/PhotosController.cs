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
    public class PhotosController : ControllerBase
    {
        private readonly IPhotoService _photoService;

        private readonly IMapper _mapper;
        private readonly ISerializeService _serializeService;
        public PhotosController(
            IPhotoService photoService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetPhotoByPaging([FromBody] PhotoRequest photoRequest)
        {
            var result =
                await _photoService.GetPhotoByPaging(photoRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                 CreatePhotoDto([FromForm] PhotoUploadDto photoUploadDto)
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
                    return BadRequest(new ApiErrorResult<Photo
                    >(lstErrorString));
                }
            }
            var photo = _serializeService
         .Deserialize<Photo>(photoUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                photo.Status = Status.Enabled;
            }
            string fileAttachmentPath = "";
            // Upload file attachment if exist
            if (photoUploadDto.FileAttachment != null)
            {
                List<string> lstStringFile = new List<string>();
                foreach (var item in photoUploadDto.FileAttachment)
                {
                    lstStringFile.Add(await item.UploadFile(CommonConstants.IMAGES_PATH));
                }
                fileAttachmentPath = String.Join(";;", lstStringFile.ToArray());
            }
            photo.ImagePath = fileAttachmentPath;
            await _photoService.CreatePhoto(photo);

            var result = _mapper.Map<PhotoDto>(photo);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPhotoById([Required] int id)
        {
            Photo? photo = await _photoService.GetPhoto(id);
            if (photo == null) return NotFound();

            var result = _mapper.Map<PhotoDto>(photo);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdatePhotoDto(
           [Required] int id,
          [FromForm] PhotoUploadDto photoUploadDto
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
                    return BadRequest(new ApiErrorResult<Photo
                    >(lstErrorString));
                }
            }

            Photo? photo = await _photoService.GetPhoto(id);

            if (photo == null) return NotFound();
            var tempFileAttachmentPath = photo.ImagePath;
            var photoUpdated = new Photo();
            if (!string.IsNullOrEmpty(photoUploadDto.JsonString))
            {
                photoUpdated = _serializeService
                                    .Deserialize<Photo>(photoUploadDto.JsonString);
                photoUpdated.Id = photo.Id;
                photoUpdated.CreatedDate = photo.CreatedDate;
            }

            string fileAttachmentPath = !String.IsNullOrEmpty(photoUpdated.ImagePath) ? photoUpdated.ImagePath : "";
            // Upload file attachment if exist
            if (photoUploadDto.FileAttachment != null)
            {
                List<string> lstStringFile = new List<string>();
                foreach (var item in photoUploadDto.FileAttachment)
                {
                    lstStringFile.Add(await item.UploadFile(CommonConstants.IMAGES_PATH));
                }
                fileAttachmentPath += ";;" + String.Join(";;", lstStringFile.ToArray());
                if (fileAttachmentPath.StartsWith(";;"))
                {
                    fileAttachmentPath = fileAttachmentPath.Remove(0, 2);
                }
            }
            photoUpdated.ImagePath = fileAttachmentPath;
            await _photoService.UpdatePhoto(photoUpdated);
            foreach (var item in tempFileAttachmentPath.Split(";;"))
            {
                if (!fileAttachmentPath.Split(";;").Contains(item))
                {
                    FileInfo fileFileAttachment =
                                                                  new FileInfo(Directory.GetCurrentDirectory() +
                                                                      "/wwwroot" + item);
                    if (fileFileAttachment.Exists)
                    {
                        fileFileAttachment.Delete();
                    }
                }
            }
            var result = _mapper.Map<PhotoDto>(photo);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePhotoDto([Required] int id)
        {
            Photo? photo = await _photoService.GetPhoto(id);
            if (photo == null) return NotFound();
            if (!string.IsNullOrEmpty(photo.ImagePath))
            {
                if (!string.IsNullOrEmpty(photo.ImagePath) && photo.ImagePath.Contains(";;"))
                {
                    foreach (var item in photo.ImagePath.Split(";;"))
                    {
                        FileInfo fileFileAttachment =
                                                       new FileInfo(Directory.GetCurrentDirectory() +
                                                           "/wwwroot" + item);
                        if (fileFileAttachment.Exists)
                        {
                            fileFileAttachment.Delete();
                        }
                    }
                }
                else
                {
                    FileInfo fileFileAttachment =
                                                        new FileInfo(Directory.GetCurrentDirectory() +
                                                            "/wwwroot" + photo.ImagePath);
                    if (fileFileAttachment.Exists)
                    {
                        fileFileAttachment.Delete();
                    }
                }
            }
            await _photoService.DeletePhoto(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyPhotoDto(
    [FromBody] UpdateManyDto<int> photoUpdateManyDto
  )
        {
            await _photoService.UpdateManyPhotoDto(photoUpdateManyDto.Ids, photoUpdateManyDto.Value.Value, photoUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
