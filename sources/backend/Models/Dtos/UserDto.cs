using System;
using Contracts.Domains;

namespace Models.Dtos
{
    public class UserDto : DtoBase
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string PasswordNew { get; set; }
        public string RePasswordNew { get; set; }
    }
}
