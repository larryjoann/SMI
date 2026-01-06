using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Ressource_processus")]
    public class RessourceProcessus
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
        [Column("id_categorie_ressources")]
        public int IdCategorieRessources { get; set; }

        [ForeignKey("IdCategorieRessources")]
        public CategorieRessources? CategorieRessources { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }
    }
}