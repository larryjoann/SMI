using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace api_SMI.Models
{
    [Table("Plan_action")]
    public class PlanAction
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_status_pa")]
        public int? IdStatusPA { get; set; }
        
        [ForeignKey("IdStatusPA")]
        public StatusPA? StatusPA { get; set; }

        [Required]
        [Column("id_source_pa")]
        public int? IdSourcePA { get; set; }

        [ForeignKey("IdSourcePA")]
        public SourcePA? SourcePA { get; set; }

        [Column("date_constat")]
        public DateTime? DateConstat { get; set; }

        [Column("constat")]
        public string? Constat { get; set; }

        [Column("status")]
        public bool? Status { get; set; } = true;

        // Navigation vers plusieurs enregistrements de processus concernés
        public ICollection<ProcessusConcernePA> ProcessusConcernes { get; set; } = new List<ProcessusConcernePA>();
    }
}
