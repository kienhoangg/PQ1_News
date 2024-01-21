using System.ComponentModel.DataAnnotations;
using AutoMapper;
using Common.Enums;
using Common.Extensions;
using Common.Interfaces;
using Common.Shared.Constants;
using Infrastructure.Shared.SeedWork;
using Microsoft.AspNetCore.Mvc;
using Models.Constants;
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
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;
        private readonly ISerializeService _serializeService;
        private readonly IMapper _mapper;

        public QuestionsController(
            IQuestionService questionService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _questionService = questionService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetQuestionByPaging([FromBody] QuestionRequest questionRequest)
        {
            var result =
                await _questionService.GetQuestionByPaging(questionRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
             CreateQuestionDto([FromForm] QuestionUploadDto questionUploadDto)
        {
            if (!ModelState.IsValid)
            {
                // Cover case avatar extension not equal
                var lstError = ModelState.SelectMany(x => x.Value.Errors);
                if (lstError.Count() > 0)
                {
                    var lstErrorString = new List<string>();
                    foreach (var err in lstError)
                    {
                        lstErrorString.Add(err.ErrorMessage);
                    }
                    return BadRequest(new ApiErrorResult<Question
                    >(lstErrorString));
                }
            }
            var question = _serializeService
                   .Deserialize<Question>(questionUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                question.Status = Status.Enabled;
            }
            string fileAttachmentPath = "";
            // Upload file attachment if exist
            if (questionUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await questionUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }

            question.FilePath = fileAttachmentPath;
            await _questionService.CreateQuestion(question);

            var result = _mapper.Map<QuestionDto>(question);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetQuestionById([Required] int id)
        {
            Question? question = await _questionService.GetQuestion(id);
            if (question == null) return NotFound();

            var result = _mapper.Map<QuestionDto>(question);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
         UpdateQuestionDto(
             [Required] int id,
             [FromForm] QuestionUploadDto questionUploadDto
         )
        {
            if (!ModelState.IsValid)
            {
                // Cover case avatar extension not equal
                var lstError = ModelState.SelectMany(x => x.Value.Errors);
                if (lstError.Count() > 0)
                {
                    var lstErrorString = new List<string>();
                    foreach (var err in lstError)
                    {
                        lstErrorString.Add(err.ErrorMessage);
                    }
                    return BadRequest(new ApiErrorResult<Question
                    >(lstErrorString));
                }
            }
            Question? question = await _questionService.GetQuestion(id);
            if (question == null) return NotFound();
            var tempFileAttachmentPath = question.FilePath;
            var questionUpdated = new Question();
            if (!string.IsNullOrEmpty(questionUploadDto.JsonString))
            {
                questionUpdated =
                    _serializeService
                        .Deserialize<Question>(questionUploadDto.JsonString);
                questionUpdated.Id = question.Id;
                questionUpdated.CreatedDate = question.CreatedDate;
            }
            string fileAttachmentPath = !String.IsNullOrEmpty(questionUpdated.FilePath) ? questionUpdated.FilePath : "";
            // Upload file attachment if exist
            if (questionUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await questionUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.IMAGES_PATH);
            }

            questionUpdated.FilePath = fileAttachmentPath;
            await _questionService.UpdateQuestion(questionUpdated);

            if (fileAttachmentPath != tempFileAttachmentPath)
            {
                FileInfo fileFileAttachment =
                                     new FileInfo(Directory.GetCurrentDirectory() +
                                         "/wwwroot" + tempFileAttachmentPath);
                if (fileFileAttachment.Exists)
                {
                    fileFileAttachment.Delete();
                }
            }
            var result = _mapper.Map<QuestionDto>(source: questionUpdated);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteQuestionDto([Required] int id)
        {
            Question? question = await _questionService.GetQuestion(id);
            if (question == null) return NotFound();

            await _questionService.DeleteQuestion(id);
            FileInfo fileFileAttachment =
                                    new FileInfo(Directory.GetCurrentDirectory() +
                                        question.FilePath);
            if (fileFileAttachment.Exists)
            {
                fileFileAttachment.Delete();
            }
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyQuestionDto(
    [FromBody] UpdateManyDto<int> questionUpdateManyDto
  )
        {
            await _questionService.UpdateManyQuestionDto(questionUpdateManyDto.Ids, questionUpdateManyDto.Value.Value, questionUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
