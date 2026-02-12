using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Frequence_mesure")]
    public class FrequenceMesure
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nom")]
        public string Nom { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }

        [Required]
        [Column("intervalle_mois")]
        public int IntervalleMois { get; set; }

        [JsonIgnore]
        public ICollection<Indicateur>? Indicateurs { get; set; }
    }
}