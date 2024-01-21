using System;
using Contracts.Domains;

namespace Models.Entities
{
    public class Feedback : EntityAuditBase<int>
    {
        public string FullName { get; set; }
        public string? Title { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Content { get; set; }
        public bool IsPublicPersonalInfo { get; set; }
        public string? FileAttachment { get; set; }
    }
}
