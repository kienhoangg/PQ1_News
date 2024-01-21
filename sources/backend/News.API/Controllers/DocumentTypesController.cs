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
    public class DocumentTypesController : ControllerBase
    {
        private readonly IDocumentTypeService _documentTypeService;

        private readonly IMapper _mapper;

        public DocumentTypesController(
            IDocumentTypeService documentTypeService,
            IMapper mapper
        )
        {
            _documentTypeService = documentTypeService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetDocumentTypeByPaging([FromBody] DocumentTypeRequest documentTypeRequest)
        {
            var result =
                await _documentTypeService.GetDocumentTypeByPaging(documentTypeRequest);
            return Ok(result);
        }

        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
        CreateDocumentTypeDto([FromBody] DocumentTypeDto documentTypeDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                documentTypeDto.Status = Status.Enabled;
            }
            var documentType = _mapper.Map<DocumentType>(documentTypeDto);
            await _documentTypeService.CreateDocumentType(documentType);
            var result = _mapper.Map<DocumentTypeDto>(documentType);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetDocumentTypeById([Required] int id)
        {
            var documentType = await _documentTypeService.GetDocumentTypeWithParentName(id);
            if (documentType == null) return NotFound();

            return Ok(documentType);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateDocumentTypeDto(
            [Required] int id,
            [FromBody] DocumentTypeDto documentTypeDto
        )
        {
            documentTypeDto.Id = id;
            var documentType = await _documentTypeService.GetDocumentType(id);
            if (documentType == null) return NotFound();
            var updatedDocumentType = _mapper.Map(documentTypeDto, documentType);
            await _documentTypeService.UpdateDocumentType(updatedDocumentType);
            var result = _mapper.Map<DocumentTypeDto>(updatedDocumentType);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteDocumentTypeDto([Required] int id)
        {
            var documentType = await _documentTypeService.GetDocumentType(id);
            if (documentType == null) return NotFound();

            await _documentTypeService.DeleteDocumentType(id);
            return NoContent();
        }
        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyDocumentTypeDto(
    [FromBody] UpdateManyDto<int> documentTypeUpdateManyDto
  )
        {
            await _documentTypeService.UpdateManyDocumentTypeDto(documentTypeUpdateManyDto.Ids, documentTypeUpdateManyDto.Value.Value, documentTypeUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
