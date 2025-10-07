using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Priorite_nc")]
    public class PrioriteNc
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("degre")]
        public int? Degre { get; set; }

        [Column("nom")]
        public string? Nom { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }
    }
}