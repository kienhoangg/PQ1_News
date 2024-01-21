using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using AutoMapper;
using Common.Enums;
using Common.Shared.Constants;
using Microsoft.AspNetCore.Mvc;
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
    public class PhotoCategoriesController : ControllerBase
    {
        private readonly IPhotoCategoryService _photoCategoryService;

        private readonly IMapper _mapper;

        public PhotoCategoriesController(
            IPhotoCategoryService photoCategoryService,
            IMapper mapper
        )
        {
            _photoCategoryService = photoCategoryService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetPhotoCategoryByPaging([FromBody] PhotoCategoryRequest photoCategoryRequest)
        {
            var result =
                await _photoCategoryService.GetPhotoCategoryByPaging(photoCategoryRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreatePhotoCategoryDto([FromBody] PhotoCategoryDto photoCategoryDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                photoCategoryDto.Status = Status.Enabled;
            }
            var photoCategory = _mapper.Map<PhotoCategory>(photoCategoryDto);
            await _photoCategoryService.CreatePhotoCategory(photoCategory);
            var result = _mapper.Map<PhotoCategoryDto>(photoCategory);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPhotoCategoryById([Required] int id)
        {
            var lstInclude =
             new Expression<Func<PhotoCategory, object>>[] {
                    (x => x.Photos)
             };
            var photoCategory = await _photoCategoryService.GetPhotoCategoryWithParentName(id, lstInclude);
            if (photoCategory == null) return NotFound();

            return Ok(photoCategory);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdatePhotoCategoryDto(
            [Required] int id,
            [FromBody] PhotoCategoryDto photoCategoryDto
        )
        {
            photoCategoryDto.Id = id;
            PhotoCategory? PhotoCategory = await _photoCategoryService.GetPhotoCategory(id);
            if (PhotoCategory == null) return NotFound();
            var updatedPhotoCategory = _mapper.Map(photoCategoryDto, PhotoCategory);
            await _photoCategoryService.UpdatePhotoCategory(updatedPhotoCategory);
            var result = _mapper.Map<PhotoCategoryDto>(updatedPhotoCategory);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePhotoCategoryDto([Required] int id)
        {
            PhotoCategory? photoCategory = await _photoCategoryService.GetPhotoCategory(id);
            if (photoCategory == null) return NotFound();

            await _photoCategoryService.DeletePhotoCategory(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyPhotoCategoryDto(
    [FromBody] UpdateManyDto<int> photoCategoryUpdateManyDto
  )
        {
            await _photoCategoryService.UpdateManyPhotoCategoryDto(photoCategoryUpdateManyDto.Ids, photoCategoryUpdateManyDto.Value.Value, photoCategoryUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
