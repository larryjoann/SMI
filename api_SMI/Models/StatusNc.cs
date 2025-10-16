using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Status_nc")]
    public class StatusNc
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nom")]
        public string? Nom { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }

        [Column("color")]
        public string? Color { get; set; }

        [Column("id_phase_nc")]
        public int? IdPhaseNc { get; set; }

        [ForeignKey("IdPhaseNc")]
        public PhaseNc? PhaseNc { get; set; }
    
    }
}