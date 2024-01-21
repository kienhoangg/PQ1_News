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

    [Route("api/[controller]")]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly ISerializeService _serializeService;
        private readonly IMapper _mapper;

        public FeedbacksController(
            IFeedbackService feedbackService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _feedbackService = feedbackService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetFeedbackByPaging([FromBody] FeedbackRequest feedbackRequest)
        {
            var result =
                await _feedbackService.GetFeedbackByPaging(feedbackRequest);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetFeedbackById([Required] int id)
        {
            Feedback? feedback = await _feedbackService.GetFeedback(id);
            if (feedback == null) return NotFound();

            var result = _mapper.Map<FeedbackDto>(feedback);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
              CreateFeedbackDto([FromForm] FeedbackUploadDto feedbackUploadDto)
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
                    return BadRequest(new ApiErrorResult<Feedback
                    >(lstErrorString));
                }
            }
            string fileAttachmentPath = "";
            var feedback = _serializeService
                  .Deserialize<Feedback>(feedbackUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                feedback.Status = Status.Enabled;
            }
            // Upload file attachment if exist
            if (feedbackUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await feedbackUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }
            feedback.FileAttachment = fileAttachmentPath;
            await _feedbackService.CreateFeedback(feedback);

            var result = _mapper.Map<FeedbackDto>(feedback);
            return Ok(result);
        }



        [HttpPut("{id:int}")]
        public async Task<IActionResult>
      UpdateFeedbackDto(
          [Required] int id,
          [FromForm] FeedbackUploadDto feedbackUploadDto
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
                    return BadRequest(new ApiErrorResult<Feedback
                    >(lstErrorString));
                }
            }
            Feedback? feedback = await _feedbackService.GetFeedback(id);
            if (feedback == null) return NotFound();
            var tempFileAttachmentPath = feedback.FileAttachment;
            var feedbackUpdated = new Feedback();
            if (!string.IsNullOrEmpty(feedbackUploadDto.JsonString))
            {
                feedbackUpdated =
                    _serializeService
                        .Deserialize<Feedback>(feedbackUploadDto.JsonString);
                feedbackUpdated.Id = feedback.Id;
                feedbackUpdated.CreatedDate = feedback.CreatedDate;
            }
            string fileAttachmentPath = !String.IsNullOrEmpty(feedbackUpdated.FileAttachment) ? feedbackUpdated.FileAttachment : "";
            // Upload file attachment if exist
            if (feedbackUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await feedbackUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }

            feedbackUpdated.FileAttachment = fileAttachmentPath;
            await _feedbackService.UpdateFeedback(feedbackUpdated);

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
            var result = _mapper.Map<FeedbackDto>(source: feedbackUpdated);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteFeedbackDto([Required] int id)
        {
            Feedback? feedback = await _feedbackService.GetFeedback(id);
            if (feedback == null) return NotFound();

            await _feedbackService.DeleteFeedback(id);
            FileInfo fileFileAttachment =
                                    new FileInfo(Directory.GetCurrentDirectory() +
                                        feedback.FileAttachment);
            if (fileFileAttachment.Exists)
            {
                fileFileAttachment.Delete();
            }
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
      UpdateManyFeedbackDto(
        [FromBody] UpdateManyDto<int> feedbackUpdateManyDto
      )
        {
            //  var lstFeedbackId = strFeedbackId.Split(',').Select(long.Parse).ToList();
            await _feedbackService.UpdateManyFeedbackDto(feedbackUpdateManyDto.Ids, feedbackUpdateManyDto.Value.Value, feedbackUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
