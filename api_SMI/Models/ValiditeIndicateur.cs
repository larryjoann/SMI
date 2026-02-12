using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Validite_indicateur")]
    public class ValiditeIndicateur
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_indicateur")]
        public int IdIndicateur { get; set; }

        [ForeignKey(nameof(IdIndicateur))]
        [JsonIgnore]
        public Indicateur? Indicateur { get; set; }

        [Required]
        [Column("annee")]
        public int Annee { get; set; }
    }
}