namespace Models.Dtos
{
    public class DocumentsMasterDataDto
    {
        public List<DocumentTypeDto> DocumentTypes { get; set; }
        public List<DocumentFieldDto> DocumentFields { get; set; }
        public List<DocumentDepartmentDto> DocumentDepartments { get; set; }
        public List<DocumentSignPersonDto> DocumentSignPersons { get; set; }
    }
}