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
    public class SourceNewsController : ControllerBase
    {
        private readonly ISourceNewsService _sourceNewsService;

        private readonly IMapper _mapper;

        public SourceNewsController(
            ISourceNewsService sourceNewsService,
            IMapper mapper
        )
        {
            _sourceNewsService = sourceNewsService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetSourceNewsByPaging([FromBody] SourceNewsRequest sourceNewsRequest)
        {
            var result =
                await _sourceNewsService
                    .GetSourceNewsByPaging(sourceNewsRequest);
            return Ok(result);
        }

        [HttpPost]
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        public async Task<IActionResult>
        CreateSourceNewsDto([FromBody] SourceNewsDto sourceNewsDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                sourceNewsDto.Status = Status.Enabled;
            }
            var sourceNews = _mapper.Map<SourceNews>(sourceNewsDto);
            await _sourceNewsService.CreateSourceNews(sourceNews);
            var result = _mapper.Map<SourceNewsDto>(sourceNews);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetSourceNewsById([Required] int id)
        {
            SourceNews? sourceNews = await _sourceNewsService.GetSourceNews(id);
            if (sourceNews == null) return NotFound();

            var result = _mapper.Map<SourceNewsDto>(sourceNews);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateSourceNewsDto(
            [Required] int id,
            [FromBody] SourceNewsDto sourceNewsDto
        )
        {
            sourceNewsDto.Id = id;
            SourceNews? SourceNews = await _sourceNewsService.GetSourceNews(id);
            if (SourceNews == null) return NotFound();
            var updatedSourceNews = _mapper.Map(sourceNewsDto, SourceNews);
            await _sourceNewsService.UpdateSourceNews(updatedSourceNews);
            var result = _mapper.Map<SourceNewsDto>(updatedSourceNews);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSourceNewsDto([Required] int id)
        {
            SourceNews? sourceNews = await _sourceNewsService.GetSourceNews(id);
            if (sourceNews == null) return NotFound();

            await _sourceNewsService.DeleteSourceNews(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
 UpdateManySourceNewsDto(
   [FromBody] UpdateManyDto<int> sourceNewsUpdateManyDto
 )
        {
            await _sourceNewsService.UpdateManySourceNewsDto(sourceNewsUpdateManyDto.Ids, sourceNewsUpdateManyDto.Value.Value, sourceNewsUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
