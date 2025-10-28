using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Operation")]
    public class Operation
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nom")]
        public string? Nom { get; set; }

        // [JsonIgnore]
        // public ICollection<Historique>? Historiques { get; set; }
    }
}
