using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

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
    }
}