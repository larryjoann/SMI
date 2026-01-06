using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Notification")]
    public class Notification
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("matricule_collaborateur")]
        public string? MatriculeCollaborateur { get; set; }

        [Column("datetime_notification")]
        public DateTime? DatetimeNotification { get; set; } = DateTime.Now;

        [Required]
        [Column("titre")]
        public string? Titre { get; set; }

        [Required]
        [Column("contenu")]
        public string? Contenu { get; set; }

        [Column("lue")]
        public bool Lue { get; set; } = false;

        [Required]
        [Column("id_entite")]
        public int? IdEntite { get; set; }

        [ForeignKey("IdEntite")]
        public Entite? Entite { get; set; }

        [Required]
        [Column("id_object")]
        public int? IdObject { get; set; }
    }
}
