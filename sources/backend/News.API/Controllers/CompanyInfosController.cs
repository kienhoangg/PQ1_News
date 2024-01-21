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
    public class CompanyInfosController : ControllerBase
    {
        private readonly ICompanyInfoService _companyInfoService;
        private readonly ISerializeService _serializeService;
        private readonly IMapper _mapper;

        public CompanyInfosController(
            ICompanyInfoService companyInfoService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _companyInfoService = companyInfoService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetCompanyInfoByPaging([FromBody] CompanyInfoRequest companyInfoRequest)
        {
            var result =
                await _companyInfoService.GetCompanyInfoByPaging(companyInfoRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
               CreateCompanyInfoDto([FromForm] CompanyInfoUploadDto companyInfoUploadDto)
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
                    return BadRequest(new ApiErrorResult<CompanyInfo
                    >(lstErrorString));
                }
            }
            string fileAttachmentPath = "";
            var companyInfo = _serializeService
                  .Deserialize<CompanyInfo>(companyInfoUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                companyInfo.Status = Status.Enabled;
            }
            // Upload file attachment if exist
            if (companyInfoUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await companyInfoUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }
            companyInfo.Avatar = fileAttachmentPath;
            await _companyInfoService.CreateCompanyInfo(companyInfo);

            var result = _mapper.Map<CompanyInfoDto>(companyInfo);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCompanyInfoById([Required] int id)
        {
            CompanyInfo? companyInfo = await _companyInfoService.GetCompanyInfo(id);
            if (companyInfo == null) return NotFound();

            var result = _mapper.Map<CompanyInfoDto>(companyInfo);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
      UpdateCompanyInfoDto(
          [Required] int id,
          [FromForm] CompanyInfoUploadDto companyInfoUploadDto
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
                    return BadRequest(new ApiErrorResult<CompanyInfo
                    >(lstErrorString));
                }
            }
            CompanyInfo? companyInfo = await _companyInfoService.GetCompanyInfo(id);
            if (companyInfo == null) return NotFound();
            var tempFileAttachmentPath = companyInfo.Avatar;
            var companyInfoUpdated = new CompanyInfo();
            if (!string.IsNullOrEmpty(companyInfoUploadDto.JsonString))
            {
                companyInfoUpdated =
                    _serializeService
                        .Deserialize<CompanyInfo>(companyInfoUploadDto.JsonString);
                companyInfoUpdated.Id = companyInfo.Id;
                companyInfoUpdated.CreatedDate = companyInfo.CreatedDate;
            }
            string fileAttachmentPath = !String.IsNullOrEmpty(companyInfoUpdated.Avatar) ? companyInfoUpdated.Avatar : "";
            // Upload file attachment if exist
            if (companyInfoUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await companyInfoUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }

            companyInfoUpdated.Avatar = fileAttachmentPath;
            await _companyInfoService.UpdateCompanyInfo(companyInfoUpdated);

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
            var result = _mapper.Map<CompanyInfoDto>(source: companyInfoUpdated);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCompanyInfoDto([Required] int id)
        {
            CompanyInfo? companyInfo = await _companyInfoService.GetCompanyInfo(id);
            if (companyInfo == null) return NotFound();

            await _companyInfoService.DeleteCompanyInfo(id);
            FileInfo fileFileAttachment =
                                    new FileInfo(Directory.GetCurrentDirectory() +
                                        companyInfo.Avatar);
            if (fileFileAttachment.Exists)
            {
                fileFileAttachment.Delete();
            }
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyCompanyInfoDto(
    [FromBody] UpdateManyDto<int> companyInfoUpdateManyDto
  )
        {
            await _companyInfoService.UpdateManyCompanyInfoDto(companyInfoUpdateManyDto.Ids, companyInfoUpdateManyDto.Value.Value, companyInfoUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
