using System;
using Models.Dtos;
using Models.Entities;

namespace News.API.Interfaces
{
    public interface IUserService
    {
        Task<string> Authen(UserDto userDto);
        Task<User> GetUser(UserDto userDto);
        Task UpdatePassword(User user);
        Task<User> CheckIfUserExists(UserDto userDto);
    }
}
