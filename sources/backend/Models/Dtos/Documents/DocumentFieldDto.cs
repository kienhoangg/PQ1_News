using Contracts.Domains;

namespace Models.Dtos
{
    public class DocumentFieldDto : DtoBase
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? ParentId { get; set; }
        public string ParentName { get; set; }
        public string? Description { get; set; }
    }
}