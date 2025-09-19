using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Categorie_processus")]
    public class CategorieProcessus
    {
        [Key] 
        [Column("id")]
        public int Id { get; set; }

        [Column("nom")]
        public string? Nom { get; set; }

        [JsonIgnore]
        public ICollection<Processus>? Processus { get; set; }
    }
}