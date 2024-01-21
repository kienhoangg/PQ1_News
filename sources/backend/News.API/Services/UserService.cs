using System;
using Common.Interfaces;
using Common.Shared.Constants;
using Infrastructure.Extensions;
using Infrastructure.Implements;
using Microsoft.EntityFrameworkCore;
using Models.Dtos;
using Models.Entities;
using News.API.Authorization;
using News.API.Interfaces;
using News.API.Persistence;

namespace News.API.Services
{
    public class UserService : RepositoryBase<User, int, NewsContext>, IUserService
    {
        private IJwtUtils _jwtUtils;
        public UserService(NewsContext dbContext, IUnitOfWork<NewsContext> unitOfWork, IJwtUtils jwtUtils) : base(dbContext, unitOfWork)
        {
            _jwtUtils = jwtUtils;
        }

        public async Task<User> CheckIfUserExists(UserDto userDto)
        {
            User user = null;
            var validUsers = await FindByCondition(x => x.Username == userDto.Username).ToListAsync();
            if (validUsers.Count > 0)
            {
                foreach (var validUser in validUsers)
                {
                    try
                    {
                        if (validUser.Password.Decrypt() == userDto.Password)
                        {
                            user = validUser;
                            break;
                        }
                    }
                    catch (Exception ex)
                    {
                        if (validUser.Password == userDto.Password)
                        {
                            user = validUser;
                            break;
                        }
                    }
                }
            }
            return user;
        }

        public async Task<string> Authen(UserDto userDto)
        {
            var validUsers = await FindByCondition(x => x.Username == userDto.Username).ToListAsync();
            var jwtToken = string.Empty;
            if (validUsers.Count > 0)
            {
                User user = null;
                foreach (var validUser in validUsers)
                {
                    try
                    {
                        if (validUser.Password.Decrypt() == userDto.Password)
                        {
                            user = validUser;
                            break;
                        }
                    }
                    catch (Exception ex)
                    {
                        if (validUser.Password == userDto.Password)
                        {
                            user = validUser;
                            break;
                        }
                    }
                }
                if (user != null)
                {
                    switch (userDto.Username)
                    {
                        case "admin":
                            jwtToken = _jwtUtils.GenerateJwtToken(RoleCode.ADMIN.ToString(), userDto.Username);
                            break;
                        case "siteadmin":
                            jwtToken = _jwtUtils.GenerateJwtToken(RoleCode.SITE_ADMIN.ToString(), userDto.Username);
                            break;
                        default:
                            break;
                    }
                }
            }
            return jwtToken;
        }

        public async Task<User> GetUser(UserDto userDto)
        {
            var query = FindAll();
            var validUser = await query.Where(x => x.Username == userDto.Username && x.Password == userDto.Password).FirstOrDefaultAsync();

            return validUser;
        }

        public async Task UpdatePassword(User user)
        {
            await UpdateAsync(user);
        }
    }
}
