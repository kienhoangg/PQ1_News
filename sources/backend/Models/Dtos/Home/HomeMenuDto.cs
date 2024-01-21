namespace Models.Dtos
{
    public class HomeMenuDto
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Url { get; set; }
        public bool IsRootMenu { get; set; }
        public List<MenuDto> Items { get; set; }
    }
}