using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class User : EntityAuditBase<int>
    {
        public string Username { get; set; }
        public string Password { get; set; }

    }
}

