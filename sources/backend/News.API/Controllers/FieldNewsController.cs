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
    public class FieldNewsController : ControllerBase
    {
        private readonly IFieldNewsService _fieldNewsService;

        private readonly IMapper _mapper;

        public FieldNewsController(
            IFieldNewsService fieldNewsService,
            IMapper mapper
        )
        {
            _fieldNewsService = fieldNewsService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetFieldNewsByPaging([FromBody] FieldNewsRequest fieldNewsRequest)
        {
            var result =
                await _fieldNewsService.GetFieldNewsByPaging(fieldNewsRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreateFieldNewsDto([FromBody] FieldNewsDto fieldNewsDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                fieldNewsDto.Status = Status.Enabled;
            }
            var fieldNews = _mapper.Map<FieldNews>(fieldNewsDto);
            await _fieldNewsService.CreateFieldNews(fieldNews);
            var result = _mapper.Map<FieldNewsDto>(fieldNews);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetFieldNewsById([Required] int id)
        {
            FieldNews? fieldNews = await _fieldNewsService.GetFieldNews(id);
            if (fieldNews == null) return NotFound();

            var result = _mapper.Map<FieldNewsDto>(fieldNews);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateFieldNewsDto(
            [Required] int id,
            [FromBody] FieldNewsDto fieldNewsDto
        )
        {
            fieldNewsDto.Id = id;
            FieldNews? FieldNews = await _fieldNewsService.GetFieldNews(id);
            if (FieldNews == null) return NotFound();
            var updatedFieldNews = _mapper.Map(fieldNewsDto, FieldNews);
            await _fieldNewsService.UpdateFieldNews(updatedFieldNews);
            var result = _mapper.Map<FieldNewsDto>(updatedFieldNews);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteFieldNewsDto([Required] int id)
        {
            FieldNews? fieldNews = await _fieldNewsService.GetFieldNews(id);
            if (fieldNews == null) return NotFound();

            await _fieldNewsService.DeleteFieldNews(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
      UpdateManyFieldNewsDto(
        [FromBody] UpdateManyDto<int> fieldNewsUpdateManyDto
      )
        {
            //  var lstFieldNewsId = strFieldNewsId.Split(',').Select(long.Parse).ToList();
            await _fieldNewsService.UpdateManyFieldNewsDto(fieldNewsUpdateManyDto.Ids, fieldNewsUpdateManyDto.Value.Value, fieldNewsUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
