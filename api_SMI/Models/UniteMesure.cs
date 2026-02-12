using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Unite_mesure")]
    public class UniteMesure
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nom")]
        public string Nom { get; set; }

        [Required]
        [Column("abr")]
        public string Abr { get; set; }

        [JsonIgnore]
        public ICollection<Indicateur>? Indicateurs { get; set; }
    }
}