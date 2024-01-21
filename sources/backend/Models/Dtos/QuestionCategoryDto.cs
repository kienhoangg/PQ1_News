using Contracts.Domains;

namespace Models.Dtos
{
    public class QuestionCategoryDto : DtoBase
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int ParentId { get; set; }
        public ICollection<QuestionDto> Questions { get; set; }
    }
}