using System.ComponentModel.DataAnnotations;
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
    public class PublicInformationCategoriesController : ControllerBase
    {
        private readonly IPublicInformationCategoryService _publicInformationCategoryService;

        private readonly IMapper _mapper;

        public PublicInformationCategoriesController(
            IPublicInformationCategoryService publicInformationCategoryService,
            IMapper mapper
        )
        {
            _publicInformationCategoryService = publicInformationCategoryService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetPublicInformationCategoryByPaging([FromBody] PublicInformationCategoryRequest publicInformationCategoryRequest)
        {
            var result =
                await _publicInformationCategoryService.GetPublicInformationCategoryByPaging(publicInformationCategoryRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreatePublicInformationCategoryDto([FromBody] PublicInformationCategoryDto publicInformationCategoryDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                publicInformationCategoryDto.Status = Status.Enabled;
            }
            var publicInformationCategory = _mapper.Map<PublicInformationCategory>(publicInformationCategoryDto);
            await _publicInformationCategoryService.CreatePublicInformationCategory(publicInformationCategory);
            var result = _mapper.Map<PublicInformationCategoryDto>(publicInformationCategory);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPublicInformationCategoryById([Required] int id)
        {
            PublicInformationCategory? publicInformationCategory = await _publicInformationCategoryService.GetPublicInformationCategory(id);
            if (publicInformationCategory == null) return NotFound();

            var result = _mapper.Map<PublicInformationCategoryDto>(publicInformationCategory);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdatePublicInformationCategoryDto(
            [Required] int id,
            [FromBody] PublicInformationCategoryDto publicInformationCategoryDto
        )
        {
            publicInformationCategoryDto.Id = id;
            PublicInformationCategory? PublicInformationCategory = await _publicInformationCategoryService.GetPublicInformationCategory(id);
            if (PublicInformationCategory == null) return NotFound();
            var updatedPublicInformationCategory = _mapper.Map(publicInformationCategoryDto, PublicInformationCategory);
            await _publicInformationCategoryService.UpdatePublicInformationCategory(updatedPublicInformationCategory);
            var result = _mapper.Map<PublicInformationCategoryDto>(updatedPublicInformationCategory);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePublicInformationCategoryDto([Required] int id)
        {
            PublicInformationCategory? publicInformationCategory = await _publicInformationCategoryService.GetPublicInformationCategory(id);
            if (publicInformationCategory == null) return NotFound();

            await _publicInformationCategoryService.DeletePublicInformationCategory(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
      UpdateManyPublicInformationCategoryDto(
        [FromBody] UpdateManyDto<int> publicInformationCategoryUpdateManyDto
      )
        {
            //  var lstPublicInformationCategoryId = strPublicInformationCategoryId.Split(',').Select(long.Parse).ToList();
            await _publicInformationCategoryService.UpdateManyPublicInformationCategoryDto(publicInformationCategoryUpdateManyDto.Ids, publicInformationCategoryUpdateManyDto.Value.Value, publicInformationCategoryUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
