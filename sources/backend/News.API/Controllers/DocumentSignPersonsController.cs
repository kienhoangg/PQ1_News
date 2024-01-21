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
    public class DocumentSignPersonsController : ControllerBase
    {
        private readonly IDocumentSignPersonService _documentSignPersonService;

        private readonly IMapper _mapper;

        public DocumentSignPersonsController(
            IDocumentSignPersonService documentSignPersonService,
            IMapper mapper
        )
        {
            _documentSignPersonService = documentSignPersonService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetDocumentSignPersonByPaging([FromBody] DocumentSignPersonRequest documentSignPersonRequest)
        {
            var result =
                await _documentSignPersonService.GetDocumentSignPersonByPaging(documentSignPersonRequest);
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreateDocumentSignPersonDto([FromBody] DocumentSignPersonDto documentSignPersonDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                documentSignPersonDto.Status = Status.Enabled;
            }
            var documentSignPerson = _mapper.Map<DocumentSignPerson>(documentSignPersonDto);
            await _documentSignPersonService.CreateDocumentSignPerson(documentSignPerson);
            var result = _mapper.Map<DocumentSignPersonDto>(documentSignPerson);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetDocumentSignPersonById([Required] int id)
        {
            var documentSignPerson = await _documentSignPersonService.GetDocumentSignPersonWithParentName(id);
            if (documentSignPerson == null) return NotFound();

            return Ok(documentSignPerson);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateDocumentSignPersonDto(
            [Required] int id,
            [FromBody] DocumentSignPersonDto documentSignPersonDto
        )
        {
            documentSignPersonDto.Id = id;
            DocumentSignPerson? DocumentSignPerson = await _documentSignPersonService.GetDocumentSignPerson(id);
            if (DocumentSignPerson == null) return NotFound();
            var updatedDocumentSignPerson = _mapper.Map(documentSignPersonDto, DocumentSignPerson);
            await _documentSignPersonService.UpdateDocumentSignPerson(updatedDocumentSignPerson);
            var result = _mapper.Map<DocumentSignPersonDto>(updatedDocumentSignPerson);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteDocumentSignPersonDto([Required] int id)
        {
            DocumentSignPerson? documentSignPerson = await _documentSignPersonService.GetDocumentSignPerson(id);
            if (documentSignPerson == null) return NotFound();

            await _documentSignPersonService.DeleteDocumentSignPerson(id);
            return NoContent();
        }
        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyDocumentSignPersonDto(
    [FromBody] UpdateManyDto<int> documentSignPersonUpdateManyDto
  )
        {
            await _documentSignPersonService.UpdateManyDocumentSignPersonDto(documentSignPersonUpdateManyDto.Ids, documentSignPersonUpdateManyDto.Value.Value, documentSignPersonUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
