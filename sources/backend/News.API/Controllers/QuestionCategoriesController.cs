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
    public class QuestionCategoriesController : ControllerBase
    {
        private readonly IQuestionCategoryService _questionCategoryService;

        private readonly IMapper _mapper;

        public QuestionCategoriesController(
            IQuestionCategoryService questionCategoryService,
            IMapper mapper
        )
        {
            _questionCategoryService = questionCategoryService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetQuestionCategoryByPaging([FromBody] QuestionCategoryRequest questionCategoryRequest)
        {
            var result =
                await _questionCategoryService.GetQuestionCategoryByPaging(questionCategoryRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreateQuestionCategoryDto([FromBody] QuestionCategoryDto questionCategoryDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                questionCategoryDto.Status = Status.Enabled;
            }
            var questionCategory = _mapper.Map<QuestionCategory>(questionCategoryDto);
            await _questionCategoryService.CreateQuestionCategory(questionCategory);
            var result = _mapper.Map<QuestionCategoryDto>(questionCategory);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetQuestionCategoryById([Required] int id)
        {
            QuestionCategory? questionCategory = await _questionCategoryService.GetQuestionCategory(id);
            if (questionCategory == null) return NotFound();

            var result = _mapper.Map<QuestionCategoryDto>(questionCategory);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateQuestionCategoryDto(
            [Required] int id,
            [FromBody] QuestionCategoryDto questionCategoryDto
        )
        {
            questionCategoryDto.Id = id;
            QuestionCategory? QuestionCategory = await _questionCategoryService.GetQuestionCategory(id);
            if (QuestionCategory == null) return NotFound();
            var updatedQuestionCategory = _mapper.Map(questionCategoryDto, QuestionCategory);
            await _questionCategoryService.UpdateQuestionCategory(updatedQuestionCategory);
            var result = _mapper.Map<QuestionCategoryDto>(updatedQuestionCategory);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteQuestionCategoryDto([Required] int id)
        {
            QuestionCategory? questionCategory = await _questionCategoryService.GetQuestionCategory(id);
            if (questionCategory == null) return NotFound();

            await _questionCategoryService.DeleteQuestionCategory(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyQuestionCategoryDto(
    [FromBody] UpdateManyDto<int> questionCategoryUpdateManyDto
  )
        {
            await _questionCategoryService.UpdateManyQuestionCategoryDto(questionCategoryUpdateManyDto.Ids, questionCategoryUpdateManyDto.Value.Value, questionCategoryUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
