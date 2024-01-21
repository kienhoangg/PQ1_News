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
    public class MenusController : ControllerBase
    {
        private readonly IMenuService _menuService;

        private readonly IMapper _mapper;

        public MenusController(
            IMenuService menuService,
            IMapper mapper
        )
        {
            _menuService = menuService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult>
        GetMenuByPaging([FromBody] MenuRequest menuRequest)
        {
            var result =
                await _menuService.GetMenuByPaging(menuRequest);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult>
       GetHomeAdmin()
        {
            var result =
                await _menuService.GetAdminMenu();
            return Ok(result);
        }
        [ServiceFilter(typeof(HandleStatusByRoleAttribute))]
        [HttpPost]
        public async Task<IActionResult>
                CreateMenuDto([FromBody] MenuDto menuDto)
        {
            if (HttpContext.Items["HandledStatus"] != null)
            {
                menuDto.Status = Status.Enabled;
            }
            var menu = _mapper.Map<Menu>(menuDto);
            await _menuService.CreateMenu(menu);
            var result = _mapper.Map<MenuDto>(menu);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetMenuById([Required] int id)
        {
            Menu? menu = await _menuService.GetMenu(id);
            if (menu == null) return NotFound();

            var result = _mapper.Map<MenuDto>(menu);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult>
        UpdateMenuDto(
            [Required] int id,
            [FromBody] MenuDto menuDto
        )
        {
            menuDto.Id = id;
            Menu? Menu = await _menuService.GetMenu(id);
            if (Menu == null) return NotFound();
            var updatedMenu = _mapper.Map(menuDto, Menu);
            await _menuService.UpdateMenu(updatedMenu);
            var result = _mapper.Map<MenuDto>(updatedMenu);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteMenuDto([Required] int id)
        {
            Menu? menu = await _menuService.GetMenu(id);
            if (menu == null) return NotFound();

            await _menuService.DeleteMenu(id);
            return NoContent();
        }

        [HttpPut("")]
        public async Task<IActionResult>
  UpdateManyMenuDto(
    [FromBody] UpdateManyDto<int> menuUpdateManyDto
  )
        {
            await _menuService.UpdateManyMenuDto(menuUpdateManyDto.Ids, menuUpdateManyDto.Value.Value, menuUpdateManyDto.Field.Value);
            return NoContent();
        }
    }
}
