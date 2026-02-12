using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Objectif")]
    public class Objectif
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

        [Required]
        [Column("id_objectif_strategique")]
        public int IdObjectifStrategique { get; set; }

        [ForeignKey("IdObjectifStrategique")]
        //[JsonIgnore]
        public ObjectifStrategique? ObjectifStrategique { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }

        [JsonIgnore]
        public ICollection<Indicateur>? Indicateurs { get; set; }
    }
}