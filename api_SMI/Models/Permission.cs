using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Permission")]
    public class Permission
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nom")]
        public string? Nom { get; set; }

        [Column("reference")]
        public string? Reference { get; set; }

        [Column("id_categorie_permission")]
        public int IdCategoriePermission { get; set; }
    }
}