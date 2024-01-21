using Contracts.Domains;

namespace Models.Dtos
{
    public class CollaboratorDto : DtoBase
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Username { get; set; }

        public DateTime? BirthDate { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }
    }
}
