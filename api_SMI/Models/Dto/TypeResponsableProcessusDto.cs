namespace api_SMI.Models.Dto
{
    public class TypeResponsableProcessusDto
    {
        public int Id { get; set; }
        public int IdRole { get; set; }
        public RoleDto? Role { get; set; }
    }

    public class RoleDto
    {
        public int Id { get; set; }
        public string? Libelle { get; set; }
    }
}
