using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Processus_concerne_nc")]
    public class ProcessusConcerneNc
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("id_nc")]
        [Required]
        public int IdNc { get; set; }

        // [ForeignKey("IdNc")]
        // public NonConformite? NonConformite { get; set; }

        [Column("id_processus")]
        [Required]
        public int IdProcessus { get; set; }

        [ForeignKey("IdProcessus")]
        public Processus? Processus { get; set; }
    }
}