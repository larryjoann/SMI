using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Phase_nc")]
    public class PhaseNc
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nom")]
        public string Nom { get; set; }

        [Column("ordre")]
        public int Ordre { get; set; }
    }
}
