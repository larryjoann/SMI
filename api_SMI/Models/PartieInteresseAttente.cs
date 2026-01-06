using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Partie_interesse_attente")]
    public class PartieInteresseAttente
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_processus")]
        public int IdProcessus { get; set; }

        [ForeignKey("IdProcessus")]
        [JsonIgnore]
        public Processus? Processus { get; set; }

        [Column("partie_interesse")]
        public string? PartieInteresse { get; set; }

        [Required]
        [Column("groupe")]
        public int Groupe { get; set; }

        [Column("attente")]
        public string? Attente { get; set; }
    }
}