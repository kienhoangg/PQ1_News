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
    public class LinkInfoCategoriesController : ControllerBase
    {
        private readonly ILinkInfoCategoryService _linkInfoCategoryService;

        private readonly IMapper _mapper;

        public LinkInfoCategoriesController(
            ILinkInfoCategoryService linkInfoCategoryService,
            IMapper mapper
        )
        {
            _linkInfoCategoryService = linkInfoCategoryService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetLinkInfoCategoryByPaging([FromBody] LinkInfoCategoryRequest linkInfoCategoryRequest)
        {
            var result =
                await _linkInfoCategoryService.GetLinkInfoCategoryByPaging(linkInfoCategoryRequest);
            return Ok(result);
        }

        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
        CreateLinkInfoCategoryDto([FromBody] LinkInfoCategoryDto linkInfoCategoryDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                linkInfoCategoryDto.Status = Status.Enabled;
            }
            var linkInfoCategory = _mapper.Map<LinkInfoCategory>(linkInfoCategoryDto);
            await _linkInfoCategoryService.CreateLinkInfoCategory(linkInfoCategory);
            var result = _mapper.Map<LinkInfoCategoryDto>(linkInfoCategory);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetLinkInfoCategoryById([Required] int id)
        {
            LinkInfoCategory? linkInfoCategory = await _linkInfoCategoryService.GetLinkInfoCategory(id);
            if (linkInfoCategory == null) return NotFound();

            var result = _mapper.Map<LinkInfoCategoryDto>(linkInfoCategory);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateLinkInfoCategoryDto(
            [Required] int id,
            [FromBody] LinkInfoCategoryDto linkInfoCategoryDto
        )
        {
            linkInfoCategoryDto.Id = id;
            LinkInfoCategory? LinkInfoCategory = await _linkInfoCategoryService.GetLinkInfoCategory(id);
            if (LinkInfoCategory == null) return NotFound();
            var updatedLinkInfoCategory = _mapper.Map(linkInfoCategoryDto, LinkInfoCategory);
            await _linkInfoCategoryService.UpdateLinkInfoCategory(updatedLinkInfoCategory);
            var result = _mapper.Map<LinkInfoCategoryDto>(updatedLinkInfoCategory);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteLinkInfoCategoryDto([Required] int id)
        {
            LinkInfoCategory? linkInfoCategory = await _linkInfoCategoryService.GetLinkInfoCategory(id);
            if (linkInfoCategory == null) return NotFound();

            await _linkInfoCategoryService.DeleteLinkInfoCategory(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyLinkInfoCategoryDto(
    [FromBody] UpdateManyDto<int> linkInfoCategoryUpdateManyDto
  )
        {
            await _linkInfoCategoryService.UpdateManyLinkInfoCategoryDto(linkInfoCategoryUpdateManyDto.Ids, linkInfoCategoryUpdateManyDto.Value.Value, linkInfoCategoryUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
