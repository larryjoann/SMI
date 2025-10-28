using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Commentaire_nc")]
    public class CommentaireNc
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_nc")]
        public int IdNc { get; set; }

        // [ForeignKey("IdNc")]
        // [JsonIgnore]
        // public NonConformite? NonConformite { get; set; }

        [Required]
        [Column("matricule_collaborateur")]
        public string? MatriculeCollaborateur { get; set; }

        [ForeignKey("MatriculeCollaborateur")]
        public Collaborateur? Collaborateur { get; set; }

        [Column("datetime_commentaire")]
        public DateTime? DateTimeCommentaire { get; set; }

        [Required]
        [Column("contenu")]
        public string? Contenu { get; set; }
    }
}
