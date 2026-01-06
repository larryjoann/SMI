namespace api_SMI.Models.Dto
{
    public class ResponsableProcessusDto
    {
        public int Id { get; set; }
        public string? MatriculeCollaborateur { get; set; }
        public int IdProcessus { get; set; }
        public int IdTypeResponsableProcessus { get; set; }
        public CollaborateurDto? Collaborateur { get; set; }
        public ProcessusDto? Processus { get; set; }
        public TypeResponsableProcessusDto? TypeResponsableProcessus { get; set; }
    }

    public class CollaborateurDto
    {
        public string? Matricule { get; set; }
        public string? Nom { get; set; }
        public string? Prenom { get; set; }
        public string? Email { get; set; }
    }

    public class ProcessusDto
    {
        public int Id { get; set; }
        public string? Nom { get; set; }
        public string? Sigle { get; set; }
    }
}
