using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Pilote")]
    public class Pilote
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("matricule_collaborateur")]
        public string? MatriculeCollaborateur { get; set; }

        [ForeignKey("MatriculeCollaborateur")]
        public Collaborateur? Collaborateur { get; set; }

        [Required]
        [Column("id_processus")]
        public int IdProcessus { get; set; }

        [ForeignKey("IdProcessus")]
        [JsonIgnore]
        public Processus? Processus { get; set; }
    }
}