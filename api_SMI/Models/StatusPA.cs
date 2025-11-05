using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Status_PA")]
    public class StatusPA
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nom")]
        public string? Nom { get; set; }

        [Column("color")]
        public string? Color { get; set; }
    }
}
