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
    public class CollaboratorsController : ControllerBase
    {
        private readonly ICollaboratorService _collaboratorService;

        private readonly IMapper _mapper;

        public CollaboratorsController(
            ICollaboratorService collaboratorService,
            IMapper mapper
        )
        {
            _collaboratorService = collaboratorService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetCollaboratorByPaging(
            [FromBody] CollaboratorRequest collaboratorRequest
        )
        {
            var result =
                await _collaboratorService
                    .GetCollaboratorByPaging(collaboratorRequest);
            return Ok(result);
        }

        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
        CreateCollaboratorDto([FromBody] CollaboratorDto collaboratorDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                collaboratorDto.Status = Status.Enabled;
            }
            var collaborator = _mapper.Map<Collaborator>(collaboratorDto);
            await _collaboratorService.CreateCollaborator(collaborator);
            var result = _mapper.Map<CollaboratorDto>(collaborator);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCollaboratorById([Required] int id)
        {
            Collaborator? collaborator =
                await _collaboratorService.GetCollaborator(id);
            if (collaborator == null) return NotFound();

            var result = _mapper.Map<CollaboratorDto>(collaborator);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateCollaboratorDto(
            [Required] int id,
            [FromBody] CollaboratorDto collaboratorDto
        )
        {
            collaboratorDto.Id = id;
            Collaborator? Collaborator =
                await _collaboratorService.GetCollaborator(id);
            if (Collaborator == null) return NotFound();
            var updatedCollaborator =
                _mapper.Map(collaboratorDto, Collaborator);
            await _collaboratorService.UpdateCollaborator(updatedCollaborator);

            var result = _mapper.Map<CollaboratorDto>(updatedCollaborator);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult>
        DeleteCollaboratorDto([Required] int id)
        {
            Collaborator? collaborator =
                await _collaboratorService.GetCollaborator(id);
            if (collaborator == null) return NotFound();

            await _collaboratorService.DeleteCollaborator(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyCollaboratorDto(
    [FromBody] UpdateManyDto<int> collaboratorUpdateManyDto
  )
        {
            await _collaboratorService.UpdateManyCollaboratorDto(collaboratorUpdateManyDto.Ids, collaboratorUpdateManyDto.Value.Value, collaboratorUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
