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
    public class PublicInformationsController : ControllerBase
    {
        private readonly IPublicInformationService _publicInformationService;
        private readonly ISerializeService _serializeService;
        private readonly IMapper _mapper;

        public PublicInformationsController(
            IPublicInformationService publicInformationService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _publicInformationService = publicInformationService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetPublicInformationByPaging([FromBody] PublicInformationRequest publicInformationRequest)
        {
            var result =
                await _publicInformationService.GetPublicInformationByPaging(publicInformationRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreatePublicInformationDto([FromForm] PublicInformationUploadDto publicInformationDto)
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
                    return BadRequest(new ApiErrorResult<PublicInformation
                    >(lstErrorString));
                }
            }
            var publicInformation = _serializeService
         .Deserialize<PublicInformation>(publicInformationDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                publicInformation.Status = Status.Enabled;
            }
            string fileAttachmentPath = "";
            // Upload file attachment if exist
            if (publicInformationDto.FileAttachment != null)
            {
                List<string> lstStringFile = new List<string>();
                foreach (var item in publicInformationDto.FileAttachment)
                {
                    lstStringFile.Add(await item.UploadFile(CommonConstants.IMAGES_PATH));
                }
                fileAttachmentPath = String.Join(";;", lstStringFile.ToArray());
            }
            publicInformation.FileAttachment = fileAttachmentPath;
            await _publicInformationService.CreatePublicInformation(publicInformation);

            var result = _mapper.Map<PublicInformationDto>(publicInformation);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPublicInformationById([Required] int id)
        {
            PublicInformation? publicInformation = await _publicInformationService.GetPublicInformation(id);
            if (publicInformation == null) return NotFound();

            var result = _mapper.Map<PublicInformationDto>(publicInformation);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdatePublicInformationDto(
           [Required] int id,
          [FromForm] PublicInformationUploadDto publicInformationDto
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
                    return BadRequest(new ApiErrorResult<PublicInformation
                    >(lstErrorString));
                }
            }

            PublicInformation? publicInformation = await _publicInformationService.GetPublicInformation(id);

            if (publicInformation == null) return NotFound();
            var tempFileAttachmentPath = publicInformation.FileAttachment;
            var publicInformationUpdated = new PublicInformation();
            if (!string.IsNullOrEmpty(publicInformationDto.JsonString))
            {
                publicInformationUpdated = _serializeService
                                    .Deserialize<PublicInformation>(publicInformationDto.JsonString);
                publicInformationUpdated.Id = publicInformation.Id;
                publicInformationUpdated.CreatedDate = publicInformation.CreatedDate;
            }

            string fileAttachmentPath = !String.IsNullOrEmpty(publicInformationUpdated.FileAttachment) ? publicInformationUpdated.FileAttachment : "";
            // Upload file attachment if exist
            if (publicInformationDto.FileAttachment != null)
            {
                List<string> lstStringFile = new List<string>();
                foreach (var item in publicInformationDto.FileAttachment)
                {
                    lstStringFile.Add(await item.UploadFile(CommonConstants.IMAGES_PATH));
                }
                fileAttachmentPath += ";;" + String.Join(";;", lstStringFile.ToArray());
                if (fileAttachmentPath.StartsWith(";;"))
                {
                    fileAttachmentPath = fileAttachmentPath.Remove(0, 2);
                }
            }
            publicInformationUpdated.FileAttachment = fileAttachmentPath;
            await _publicInformationService.UpdatePublicInformation(publicInformationUpdated);
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
            var result = _mapper.Map<PublicInformationDto>(publicInformation);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePublicInformationDto([Required] int id)
        {
            PublicInformation? publicInformation = await _publicInformationService.GetPublicInformation(id);
            if (publicInformation == null) return NotFound();
            if (!string.IsNullOrEmpty(publicInformation.FileAttachment))
            {
                if (!string.IsNullOrEmpty(publicInformation.FileAttachment) && publicInformation.FileAttachment.Contains(";;"))
                {
                    foreach (var item in publicInformation.FileAttachment.Split(";;"))
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
                                                            "/wwwroot" + publicInformation.FileAttachment);
                    if (fileFileAttachment.Exists)
                    {
                        fileFileAttachment.Delete();
                    }
                }
            }
            await _publicInformationService.DeletePublicInformation(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
      UpdateManyPublicInformationDto(
        [FromBody] UpdateManyDto<int> publicInformationUpdateManyDto
      )
        {
            //  var lstPublicInformationId = strPublicInformationId.Split(',').Select(long.Parse).ToList();
            await _publicInformationService.UpdateManyPublicInformationDto(publicInformationUpdateManyDto.Ids, publicInformationUpdateManyDto.Value.Value, publicInformationUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
