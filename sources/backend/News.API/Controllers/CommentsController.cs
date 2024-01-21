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
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        private readonly IMapper _mapper;

        public CommentsController(

            IMapper mapper
,
ICommentService commentService)
        {

            _mapper = mapper;
            _commentService = commentService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetCommentByPaging([FromBody] CommentRequest commentRequest)
        {
            var lstInclude =
              new Expression<Func<Comment, object>>[] {
                    (x => x.NewsPost)
              };
            var result =
                await _commentService.GetCommentByPaging(commentRequest, lstInclude);
                
            return Ok(result);
        }

        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
        CreateCommentDto([FromBody] CommentDto commentDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                commentDto.Status = Status.Enabled;
            }
            var comment = _mapper.Map<Comment>(commentDto);
            await _commentService.CreateComment(comment);
            var result = _mapper.Map<CommentDto>(comment);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCommentById([Required] int id)
        {
            Comment? comment = await _commentService.GetComment(id);
            if (comment == null) return NotFound();

            var result = _mapper.Map<CommentDto>(comment);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateCommentDto(
            [Required] int id,
            [FromBody] CommentDto commentDto
        )
        {
            commentDto.Id = id;
            Comment? Comment = await _commentService.GetComment(id);
            if (Comment == null) return NotFound();
            var updatedComment = _mapper.Map(commentDto, Comment);
            await _commentService.UpdateComment(updatedComment);
            var result = _mapper.Map<CommentDto>(updatedComment);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCommentDto([Required] int id)
        {
            Comment? comment = await _commentService.GetComment(id);
            if (comment == null) return NotFound();

            await _commentService.DeleteComment(id);
            return NoContent();
        }
        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyCommentDto(
    [FromBody] UpdateManyDto<int> commentUpdateManyDto
  )
        {
            await _commentService.UpdateManyCommentDto(commentUpdateManyDto.Ids, commentUpdateManyDto.Value.Value, commentUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
