using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Responsable_action")]
    public class ResponsableAction
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("id_action")]
        public int IdAction { get; set; }

        [ForeignKey("IdAction")]
        [JsonIgnore]
        public Action? Action { get; set; }

        [Column("matricule_assignateur")]
        public string MatriculeAssignateur { get; set; } = string.Empty;

        [ForeignKey("MatriculeAssignateur")]
        public Collaborateur? Assignateur { get; set; }

        [Column("matricule_responsable")]
        public string MatriculeResponsable { get; set; } = string.Empty;

        [ForeignKey("MatriculeResponsable")]
        public Collaborateur? Responsable { get; set; }
    }
}
