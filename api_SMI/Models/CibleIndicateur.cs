using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Cible_indicateur")]
    public class CibleIndicateur
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("cible_optimale")]
        public double? CibleOptimale { get; set; }

        [Column("cible_min")]
        public double? CibleMin { get; set; }

        [Column("cible_max")]
        public double? CibleMax { get; set; }

        [Column("cible_description")]
        public string? CibleDescription { get; set; }

        [Required]
        [Column("id_indicateur")]
        public int IdIndicateur { get; set; }

        [ForeignKey(nameof(IdIndicateur))]
        [JsonIgnore]
        public Indicateur? Indicateur { get; set; }

        // public ICollection<MesureIndicateur>? Mesures { get; set; }
    }
}
