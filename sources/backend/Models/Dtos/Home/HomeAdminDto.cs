namespace Models.Dtos
{
    public class HomeAdminDto
    {
        public string? Title { get; set; }
        public int? Key { get; set; }
        public string? Url { get; set; }
        public bool IsRootMenu { get; set; }
        public List<MenuAdminDto> Children { get; set; }
    }
}