using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Responsable_processus")]
    public class ResponsableProcessus
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Le matricule du collaborateur est obligatoire.")]
        [Column("matricule_collaborateur")]
        public string? MatriculeCollaborateur { get; set; }

        [ForeignKey("MatriculeCollaborateur")]
        public Collaborateur? Collaborateur { get; set; }

        [Required(ErrorMessage = "Le processus est obligatoire.")]
        [Column("id_processus")]
        public int IdProcessus { get; set; }

        [ForeignKey("IdProcessus")]
        [JsonIgnore]
        public Processus? Processus { get; set; }

        [Required(ErrorMessage = "Le type de responsable est obligatoire.")]
        [Column("id_type_responsable_processus")]
        public int IdTypeResponsableProcessus { get; set; }

        [ForeignKey("IdTypeResponsableProcessus")]
        public TypeResponsableProcessus? TypeResponsableProcessus { get; set; }
    }
}
