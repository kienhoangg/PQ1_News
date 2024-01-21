using Infrastructure.Shared.Paging;

namespace Models.Dtos
{
    public class NewsPostCategoryEachFieldsDto
    {
        public CategoryNewsDto CategoryNews { get; set; }
        public PagedResult<NewsPostWithoutContentDto> NewsPosts { get; set; }
    }
}