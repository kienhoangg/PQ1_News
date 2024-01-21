namespace Models.Dtos.Home
{
    public class NewsSectionDto
    {
        public CategoryNewsDto CategoryNews { get; set; }

        public List<NewsPostDto> Data { get; set; }
    }
}
