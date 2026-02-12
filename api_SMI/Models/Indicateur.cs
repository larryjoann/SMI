using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Indicateur")]
    public class Indicateur
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nom")]
        public string Nom { get; set; }

        [Required]
        [Column("id_objectif")]
        public int IdObjectif { get; set; }

        [ForeignKey(nameof(IdObjectif))]
        public Objectif? Objectif { get; set; }

        [Required]
        [Column("id_unite_mesure")]
        public int IdUniteMesure { get; set; }

        [ForeignKey(nameof(IdUniteMesure))]
        public UniteMesure? UniteMesure { get; set; }

        [Required]
        [Column("id_frequence_mesure")]
        public int IdFrequenceMesure { get; set; }

        [ForeignKey(nameof(IdFrequenceMesure))]
        public FrequenceMesure? FrequenceMesure { get; set; }

        [Column("source")]
        public string? Source { get; set; }

        public ICollection<ValiditeIndicateur>? Validites { get; set; }

        public ICollection<MesureIndicateur>? Mesures { get; set; }
        public ICollection<CibleIndicateur>? Cibles { get; set; }
    }
}