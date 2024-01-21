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
    public class DocumentDepartmentsController : ControllerBase
    {
        private readonly IDocumentDepartmentService _documentDepartmentService;

        private readonly IMapper _mapper;

        public DocumentDepartmentsController(
            IDocumentDepartmentService documentDepartmentService,
            IMapper mapper
        )
        {
            _documentDepartmentService = documentDepartmentService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetDocumentDepartmentByPaging([FromBody] DocumentDepartmentRequest documentDepartmentRequest)
        {
            var result =
                await _documentDepartmentService.GetDocumentDepartmentByPaging(documentDepartmentRequest);
            return Ok(result);
        }

        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
        CreateDocumentDepartmentDto([FromBody] DocumentDepartmentDto documentDepartmentDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                documentDepartmentDto.Status = Status.Enabled;
            }
            var documentDepartment = _mapper.Map<DocumentDepartment>(documentDepartmentDto);
            await _documentDepartmentService.CreateDocumentDepartment(documentDepartment);
            var result = _mapper.Map<DocumentDepartmentDto>(documentDepartment);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetDocumentDepartmentById([Required] int id)
        {
            var documentDepartment = await _documentDepartmentService.GetDocumentDepartmentWithParentName(id);
            if (documentDepartment == null) return NotFound();

            return Ok(documentDepartment);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateDocumentDepartmentDto(
            [Required] int id,
            [FromBody] DocumentDepartmentDto documentDepartmentDto
        )
        {
            documentDepartmentDto.Id = id;
            DocumentDepartment? DocumentDepartment = await _documentDepartmentService.GetDocumentDepartment(id);
            if (DocumentDepartment == null) return NotFound();
            var updatedDocumentDepartment = _mapper.Map(documentDepartmentDto, DocumentDepartment);
            await _documentDepartmentService.UpdateDocumentDepartment(updatedDocumentDepartment);
            var result = _mapper.Map<DocumentDepartmentDto>(updatedDocumentDepartment);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteDocumentDepartmentDto([Required] int id)
        {
            DocumentDepartment? documentDepartment = await _documentDepartmentService.GetDocumentDepartment(id);
            if (documentDepartment == null) return NotFound();

            await _documentDepartmentService.DeleteDocumentDepartment(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyDocumentDepartmentDto(
    [FromBody] UpdateManyDto<int> documentDepartmentUpdateManyDto
  )
        {
            await _documentDepartmentService.UpdateManyDocumentDepartmentDto(documentDepartmentUpdateManyDto.Ids, documentDepartmentUpdateManyDto.Value.Value, documentDepartmentUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
