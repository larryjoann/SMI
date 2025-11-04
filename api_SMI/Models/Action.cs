using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Action")]
    public class Action
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("date_debut")]
        public DateTime? DateDebut { get; set; }

        [Column("titre")]
        public string Titre { get; set; } = string.Empty;

        [Column("descr")]
        public string? Descr { get; set; }

        [Column("date_fin_prevue")]
        public DateTime? DateFinPrevue { get; set; }

        [Column("date_fin_reelle")]
        public DateTime? DateFinReelle { get; set; }

        // Foreign key to Status_action (DB column: id_status_action)
        [Column("id_status_action")]
        public int IdStatusAction { get; set; }

        [Column("status")]
        public bool? Status { get; set; }

        // Navigation property
        [ForeignKey("IdStatusAction")]
        public StatusAction? StatusAction { get; set; }

        // Navigation
        public ICollection<SuiviAction> Suivis { get; set; } = new List<SuiviAction>();
        public ICollection<SourceAction> Sources { get; set; } = new List<SourceAction>();
        public ICollection<ResponsableAction> Responsables { get; set; } = new List<ResponsableAction>();
    }
}
