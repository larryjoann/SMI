using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Lieu")]
    public class Lieu
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nom")]
        public string? Nom { get; set; }

        [Column("abr")]
        public string? Abr { get; set; }
    }
}