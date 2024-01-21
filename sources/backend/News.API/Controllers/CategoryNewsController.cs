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
    public class CategoryNewsController : ControllerBase
    {
        private readonly ICategoryNewsService _categoryNewsService;

        private readonly IMapper _mapper;

        public CategoryNewsController(
            ICategoryNewsService categoryNewsService,
            IMapper mapper
        )
        {
            _categoryNewsService = categoryNewsService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetCategoryNewsByPaging(
            [FromBody] CategoryNewsRequest categoryNewsRequest
        )
        {
            var result =
                await _categoryNewsService
                    .GetCategoryNewsByPaging(categoryNewsRequest);
            return Ok(result);
        }

        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
        CreateCategoryNewsDto([FromBody] CategoryNewsDto categoryNewsDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                categoryNewsDto.Status = Status.Enabled;
            }
            var categoryNews = _mapper.Map<CategoryNews>(categoryNewsDto);
            await _categoryNewsService.CreateCategoryNews(categoryNews);
            var result = _mapper.Map<CategoryNewsDto>(categoryNews);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCategoryNewsById([Required] int id)
        {
            var categoryNews = await _categoryNewsService.GetCategoryNewsWithParentName(id, x => x.NewsPosts);
            if (categoryNews == null) return NotFound();
            return Ok(categoryNews);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateCategoryNewsDto(
            [Required] int id,
            [FromBody] CategoryNewsDto categoryNewsDto
        )
        {
            categoryNewsDto.Id = id;
            CategoryNews? categoryNews =
                await _categoryNewsService.GetCategoryNews(id);
            if (categoryNews == null) return NotFound();
            var updatedCategoryNews =
                _mapper.Map(categoryNewsDto, categoryNews);
            await _categoryNewsService.UpdateCategoryNews(updatedCategoryNews);
            var result = _mapper.Map<CategoryNewsDto>(updatedCategoryNews);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult>
        DeleteCategoryNewsDto([Required] int id)
        {

            CategoryNews? categoryNews =
                await _categoryNewsService.GetCategoryNews(id);
            if (categoryNews == null) return NotFound();

            await _categoryNewsService.DeleteCategoryNews(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
     UpdateManyCategoryNewsDto(
       [FromBody] UpdateManyDto<int> categoryNewsUpdateManyDto
     )
        {
            await _categoryNewsService.UpdateManyCategoryNewsDto(categoryNewsUpdateManyDto.Ids, categoryNewsUpdateManyDto.Value.Value, categoryNewsUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
