using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Objectif_strategique")]
    public class ObjectifStrategique
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }

        [JsonIgnore]
        public ICollection<Objectif>? Objectifs { get; set; }
    }
}