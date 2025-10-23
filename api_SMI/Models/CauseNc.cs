using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Cause_nc")]
    public class CauseNc
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_categorie_cause_nc")]
        public int IdCategorieCauseNc { get; set; }

        [ForeignKey("IdCategorieCauseNc")]
        public CategorieCauseNc? CategorieCauseNc { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }

        [Required]
        [Column("id_nc")]
        public int IdNc { get; set; }

        [ForeignKey("IdNc")]
        [JsonIgnore]
        public NonConformite? NonConformite { get; set; }
    }
}
