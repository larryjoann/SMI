using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Historique")]
    public class Historique
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("datetime")]
        public DateTime Datetime { get; set; }

        [Required]
        [Column("matricule_collaborateur")]
        public string? MatriculeCollaborateur { get; set; }

        [ForeignKey("MatriculeCollaborateur")]
        public Collaborateur? Collaborateur { get; set; }

        [Required]
        [Column("id_operation")]
        public int IdOperation { get; set; }

        [ForeignKey("IdOperation")]
        public Operation? Operation { get; set; }

        [Required]
        [Column("id_entite")]
        public int IdEntite { get; set; }

        [ForeignKey("IdEntite")]
        public Entite? Entite { get; set; }

        [Column("id_object")]
        public int? IdObject { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }

        [Column("usefull_data")]
        public string? UsefullData { get; set; }
    }
}
