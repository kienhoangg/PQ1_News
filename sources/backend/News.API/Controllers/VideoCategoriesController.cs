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
    public class VideoCategoriesController : ControllerBase
    {
        private readonly IVideoCategoryService _videoCategoryService;

        private readonly IMapper _mapper;

        public VideoCategoriesController(
            IVideoCategoryService videoCategoryService,
            IMapper mapper
        )
        {
            _videoCategoryService = videoCategoryService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetVideoCategoryByPaging([FromBody] VideoCategoryRequest videoCategoryRequest)
        {
            var result =
                await _videoCategoryService.GetVideoCategoryByPaging(videoCategoryRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreateVideoCategoryDto([FromBody] VideoCategoryDto videoCategoryDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                videoCategoryDto.Status = Status.Enabled;
            }
            var videoCategory = _mapper.Map<VideoCategory>(videoCategoryDto);
            await _videoCategoryService.CreateVideoCategory(videoCategory);
            var result = _mapper.Map<VideoCategoryDto>(videoCategory);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetVideoCategoryById([Required] int id)
        {
            VideoCategory? videoCategory = await _videoCategoryService.GetVideoCategory(id);
            if (videoCategory == null) return NotFound();

            var result = _mapper.Map<VideoCategoryDto>(videoCategory);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateVideoCategoryDto(
            [Required] int id,
            [FromBody] VideoCategoryDto videoCategoryDto
        )
        {
            videoCategoryDto.Id = id;
            VideoCategory? VideoCategory = await _videoCategoryService.GetVideoCategory(id);
            if (VideoCategory == null) return NotFound();
            var updatedVideoCategory = _mapper.Map(videoCategoryDto, VideoCategory);
            await _videoCategoryService.UpdateVideoCategory(updatedVideoCategory);
            var result = _mapper.Map<VideoCategoryDto>(updatedVideoCategory);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteVideoCategoryDto([Required] int id)
        {
            VideoCategory? videoCategory = await _videoCategoryService.GetVideoCategory(id);
            if (videoCategory == null) return NotFound();

            await _videoCategoryService.DeleteVideoCategory(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
 UpdateManyVideoCategoryDto(
   [FromBody] UpdateManyDto<int> videoCategoryUpdateManyDto
 )
        {
            await _videoCategoryService.UpdateManyVideoCategoryDto(videoCategoryUpdateManyDto.Ids, videoCategoryUpdateManyDto.Value.Value, videoCategoryUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
