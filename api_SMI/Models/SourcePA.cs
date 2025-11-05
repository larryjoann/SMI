using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace api_SMI.Models
{
    [Table("Source_PA")]
    public class SourcePA
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }

        // Navigation vers plusieurs plans d'action
        //public ICollection<PlanAction> PlanActions { get; set; } = new List<PlanAction>();
    }
}
