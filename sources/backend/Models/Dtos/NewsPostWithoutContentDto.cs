namespace Models.Dtos
{
    public class NewsPostWithoutContentDto
    {
        public long Id { get; set; }

        public string? Title { get; set; }

        public DateTime? PublishedDate { get; set; }

        public bool? IsHotNews { get; set; }

        public bool? IsVideoNews { get; set; }

        public bool? IsShowTitle { get; set; }

        public bool? IsShowAvatar { get; set; }

        public bool? IsShowComment { get; set; }

        public string? AvatarTitle { get; set; }

        public string? Description { get; set; }

        public string? FilePath { get; set; }

        public string? Avatar { get; set; }

        public FieldNewsDto FieldNews { get; set; }

        public SourceNewsDto SourceNews { get; set; }

        public CategoryNewsDto CategoryNews { get; set; }
    }
}