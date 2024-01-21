using System.ComponentModel;

namespace Models.Dtos
{
    public class NewsPublishedDetailDto
    {
        public NewsPostDto NewsPostDetail { get; set; }

        public CategoryNewsDto CategoryParentNews { get; set; }

        public List<NewsPostDto> NewsRelatives { get; set; }
    }
}
