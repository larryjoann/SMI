using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Categorie_ressources")]
    public class CategorieRessources
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nom")]
        public string? Nom { get; set; }
    }
}