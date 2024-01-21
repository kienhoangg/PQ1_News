using System;
using AutoMapper;
using Contracts.Interfaces;
using Infrastructure.Extensions;
using Infrastructure.Shared.SeedWork;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models.Dtos;
using Models.Entities;
using News.API.Interfaces;

namespace News.API.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ISecurityService _securityService;

        private readonly IMapper _mapper;

        public UsersController(
            IUserService userService,
            IMapper mapper
,
            ISecurityService securityService)
        {
            _userService = userService;
            _mapper = mapper;
            _securityService = securityService;
        }

        [HttpPut]
        public async Task<IActionResult> ChangePassword([FromBody] UserDto userDto)
        {
            if (userDto.RePasswordNew != userDto.PasswordNew)
            {
                return BadRequest(new ApiErrorResult<UserDto>("PasswordNew no same RePasswordNew"));
            }

            if (userDto.Password == userDto.PasswordNew)
            {
                return BadRequest(new ApiErrorResult<UserDto>("PasswordNew same PasswordOld"));
            }
            var user = await _userService.CheckIfUserExists(userDto);
            if (user == null)
            {
                return BadRequest(new ApiErrorResult<UserDto>("Not found account"));
            }
            userDto.PasswordNew = userDto.PasswordNew.Encrypt();
            user.Password = userDto.PasswordNew;
            await _userService.UpdatePassword(user);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Authen([FromBody] UserDto userDto)
        {
            string token = await _userService.Authen(userDto);
            if (!string.IsNullOrEmpty(token))
            {
                return Ok(new ApiSuccessResult<String>(token));
            }
            return BadRequest();
        }
    }
}
