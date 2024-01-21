using System.ComponentModel.DataAnnotations.Schema;
using Contracts.Domains;

namespace Models.Entities
{
    public class CategoryNews : EntityAuditBase<int>
    {
        public string CategoryNewsName { get; set; }

        public int ParentId { get; set; }

        public int? FieldNews_SK_FK { get; set; }

        [ForeignKey("FieldNews_SK_FK")]
        public FieldNews? FieldNews { get; set; }

        public string? Keyword { get; set; }

        public virtual ICollection<NewsPost> NewsPosts { get; set; }
    }
}
