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
    public class RadiosController : ControllerBase
    {
        private readonly IRadioService _radioService;
        private readonly ISerializeService _serializeService;
        private readonly IMapper _mapper;

        public RadiosController(
            IRadioService radioService,
            IMapper mapper
,
            ISerializeService serializeService)
        {
            _radioService = radioService;
            _mapper = mapper;
            _serializeService = serializeService;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetRadioByPaging([FromBody] RadioRequest radioRequest)
        {
            var result =
                await _radioService.GetRadioByPaging(radioRequest);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRadioById([Required] int id)
        {
            Radio? radio = await _radioService.GetRadio(id);
            if (radio == null) return NotFound();

            var result = _mapper.Map<RadioDto>(radio);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
              CreateRadioDto([FromForm] RadioUploadDto radioUploadDto)
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
                    return BadRequest(new ApiErrorResult<Radio
                    >(lstErrorString));
                }
            }
            string fileAttachmentPath = "";
            var radio = _serializeService
                  .Deserialize<Radio>(radioUploadDto.JsonString);
            if (HttpContext.Items["HandledStatus"] != null)
            {
                radio.Status = Status.Enabled;
            }
            // Upload file attachment if exist
            if (radioUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await radioUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }
            radio.FileAttachment = fileAttachmentPath;
            await _radioService.CreateRadio(radio);

            var result = _mapper.Map<RadioDto>(radio);
            return Ok(result);
        }



        [HttpPut("{id:int}")]
        public async Task<IActionResult>
      UpdateRadioDto(
          [Required] int id,
          [FromForm] RadioUploadDto radioUploadDto
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
                    return BadRequest(new ApiErrorResult<Radio
                    >(lstErrorString));
                }
            }
            Radio? radio = await _radioService.GetRadio(id);
            if (radio == null) return NotFound();
            var tempFileAttachmentPath = radio.FileAttachment;
            var radioUpdated = new Radio();
            if (!string.IsNullOrEmpty(radioUploadDto.JsonString))
            {
                radioUpdated =
                    _serializeService
                        .Deserialize<Radio>(radioUploadDto.JsonString);
                radioUpdated.Id = radio.Id;
                radioUpdated.CreatedDate = radio.CreatedDate;
            }
            string fileAttachmentPath = !String.IsNullOrEmpty(radioUpdated.FileAttachment) ? radioUpdated.FileAttachment : "";
            // Upload file attachment if exist
            if (radioUploadDto.FileAttachment != null)
            {
                fileAttachmentPath =
                    await radioUploadDto
                        .FileAttachment
                        .UploadFile(CommonConstants.FILE_ATTACHMENT_PATH);
            }

            radioUpdated.FileAttachment = fileAttachmentPath;
            await _radioService.UpdateRadio(radioUpdated);

            // if (fileAttachmentPath != tempFileAttachmentPath)
            // {
            //     FileInfo fileFileAttachment =
            //                          new FileInfo(Directory.GetCurrentDirectory() +
            //                              "/wwwroot" + tempFileAttachmentPath);
            //     if (fileFileAttachment.Exists)
            //     {
            //         fileFileAttachment.Delete();
            //     }
            // }
            var result = _mapper.Map<RadioDto>(source: radioUpdated);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRadioDto([Required] int id)
        {
            Radio? radio = await _radioService.GetRadio(id);
            if (radio == null) return NotFound();

            await _radioService.DeleteRadio(id);
            FileInfo fileFileAttachment =
                                    new FileInfo(Directory.GetCurrentDirectory() +
                                        radio.FileAttachment);
            if (fileFileAttachment.Exists)
            {
                fileFileAttachment.Delete();
            }
            return NoContent();
        }



        [HttpPut("")]
        public async Task<IActionResult>
      UpdateManyRadioDto(
        [FromBody] UpdateManyDto<int> radioUpdateManyDto
      )
        {
            //  var lstRadioId = strRadioId.Split(',').Select(long.Parse).ToList();
            await _radioService.UpdateManyRadioDto(radioUpdateManyDto.Ids, radioUpdateManyDto.Value.Value, radioUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
