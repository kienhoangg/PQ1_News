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
    public class StaticCategoriesController : ControllerBase
    {
        private readonly IStaticCategoryService _staticCategoryService;
        private readonly ISerializeService _serializeService;
        private readonly IMapper _mapper;

        public StaticCategoriesController(
            IStaticCategoryService staticCategoryService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _staticCategoryService = staticCategoryService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetStaticCategoryByPaging([FromBody] StaticCategoryRequest staticCategoryRequest)
        {
            var result =
                await _staticCategoryService.GetStaticCategoryByPaging(staticCategoryRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
              CreateStaticCategoryDto([FromForm] StaticCategoryUploadDto staticCategoryUploadDto)
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
                    return BadRequest(new ApiErrorResult<StaticCategory
                    >(lstErrorString));
                }
            }
            string fileAttachmentPath = "";
            var staticCategory = _serializeService
                  .Deserialize<StaticCategory>(staticCategoryUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                staticCategory.Status = Status.Enabled;
            }
            // Upload file attachment if exist
            if (staticCategoryUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await staticCategoryUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }
            staticCategory.FilePath = fileAttachmentPath;
            await _staticCategoryService.CreateStaticCategory(staticCategory);

            var result = _mapper.Map<StaticCategoryDto>(staticCategory);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetStaticCategoryById([Required] int id)
        {
            var staticCategory = await _staticCategoryService.GetStaticCategoryWithParentName(id);
            if (staticCategory == null) return NotFound();
            return Ok(staticCategory);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
     UpdateStaticCategoryDto(
         [Required] int id,
         [FromForm] StaticCategoryUploadDto staticCategoryUploadDto
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
                    return BadRequest(new ApiErrorResult<StaticCategory
                    >(lstErrorString));
                }
            }
            StaticCategory? staticCategory = await _staticCategoryService.GetStaticCategory(id);
            if (staticCategory == null) return NotFound();
            var tempFileAttachmentPath = staticCategory.FilePath;
            var staticCategoryUpdated = new StaticCategory();
            if (!string.IsNullOrEmpty(staticCategoryUploadDto.JsonString))
            {
                staticCategoryUpdated =
                    _serializeService
                        .Deserialize<StaticCategory>(staticCategoryUploadDto.JsonString);
                staticCategoryUpdated.Id = staticCategory.Id;
            }
            string fileAttachmentPath = !String.IsNullOrEmpty(staticCategoryUpdated.FilePath) ? staticCategoryUpdated.FilePath : "";
            // Upload file attachment if exist
            if (staticCategoryUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await staticCategoryUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }

            staticCategoryUpdated.FilePath = fileAttachmentPath;
            await _staticCategoryService.UpdateStaticCategory(staticCategoryUpdated);

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
            var result = _mapper.Map<StaticCategoryDto>(source: staticCategoryUpdated);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteStaticCategoryDto([Required] int id)
        {
            StaticCategory? staticCategory = await _staticCategoryService.GetStaticCategory(id);
            if (staticCategory == null) return NotFound();

            await _staticCategoryService.DeleteStaticCategory(id);
            FileInfo fileFileAttachment =
                                    new FileInfo(Directory.GetCurrentDirectory() +
                                        staticCategory.FilePath);
            if (fileFileAttachment.Exists)
            {
                fileFileAttachment.Delete();
            }
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
 UpdateManyStaticCategoryDto(
   [FromBody] UpdateManyDto<int> staticCategoryUpdateManyDto
 )
        {
            await _staticCategoryService.UpdateManyStaticCategoryDto(staticCategoryUpdateManyDto.Ids, staticCategoryUpdateManyDto.Value.Value, staticCategoryUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
