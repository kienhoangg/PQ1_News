using Models.Entities;

namespace Models.Dtos
{
    public class QuestionHomeDto
    {
        public List<QuestionDto> NewQuestions { get; set; }

        public List<QuestionDto> MostViewQuestions { get; set; }
        public List<QuestionCategory> QuestionCategories { get; set; }
    }
}