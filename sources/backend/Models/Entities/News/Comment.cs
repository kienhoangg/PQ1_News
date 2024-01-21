using System.ComponentModel.DataAnnotations.Schema;
using Contracts.Domains;

namespace Models.Entities
{
    public class Comment : EntityAuditBase<long>
    {
        public string Username { get; set; }

        public string Content { get; set; }
        public long? NewsPostId { get; set; }
        public NewsPost NewsPost { get; set; }
       
    }
}
