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
    public class RadioCategoriesController : ControllerBase
    {
        private readonly IRadioCategoryService _radioCategoryService;

        private readonly IMapper _mapper;

        public RadioCategoriesController(
            IRadioCategoryService radioCategoryService,
            IMapper mapper
        )
        {
            _radioCategoryService = radioCategoryService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetRadioCategoryByPaging([FromBody] RadioCategoryRequest radioCategoryRequest)
        {
            var result =
                await _radioCategoryService.GetRadioCategoryByPaging(radioCategoryRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreateRadioCategoryDto([FromBody] RadioCategoryDto radioCategoryDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                radioCategoryDto.Status = Status.Enabled;
            }
            var radioCategory = _mapper.Map<RadioCategory>(radioCategoryDto);
            await _radioCategoryService.CreateRadioCategory(radioCategory);
            var result = _mapper.Map<RadioCategoryDto>(radioCategory);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRadioCategoryById([Required] int id)
        {
            RadioCategory? radioCategory = await _radioCategoryService.GetRadioCategory(id);
            if (radioCategory == null) return NotFound();

            var result = _mapper.Map<RadioCategoryDto>(radioCategory);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateRadioCategoryDto(
            [Required] int id,
            [FromBody] RadioCategoryDto radioCategoryDto
        )
        {
            radioCategoryDto.Id = id;
            RadioCategory? RadioCategory = await _radioCategoryService.GetRadioCategory(id);
            if (RadioCategory == null) return NotFound();
            var updatedRadioCategory = _mapper.Map(radioCategoryDto, RadioCategory);
            await _radioCategoryService.UpdateRadioCategory(updatedRadioCategory);
            var result = _mapper.Map<RadioCategoryDto>(updatedRadioCategory);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRadioCategoryDto([Required] int id)
        {
            RadioCategory? radioCategory = await _radioCategoryService.GetRadioCategory(id);
            if (radioCategory == null) return NotFound();

            await _radioCategoryService.DeleteRadioCategory(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
      UpdateManyRadioCategoryDto(
        [FromBody] UpdateManyDto<int> radioCategoryUpdateManyDto
      )
        {
            //  var lstRadioCategoryId = strRadioCategoryId.Split(',').Select(long.Parse).ToList();
            await _radioCategoryService.UpdateManyRadioCategoryDto(radioCategoryUpdateManyDto.Ids, radioCategoryUpdateManyDto.Value.Value, radioCategoryUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
