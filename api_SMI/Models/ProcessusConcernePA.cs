using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Processus_concerne_PA")]
    public class ProcessusConcernePA
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_pa")]
        public int? IdPA { get; set; }

        [ForeignKey("IdPA")]
        [JsonIgnore]
        public PlanAction? PlanAction { get; set; }

        [Required]
        [Column("id_processus")]
        public int? IdProcessus { get; set; }

        [ForeignKey("IdProcessus")]
        public Processus? Processus { get; set; }
    }
}
