using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Role_collaborateur")]
    public class RoleCollaborateur
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("matricule_collaborateur")]
        public string? MatriculeCollaborateur { get; set; }

        [Column("id_role")]
        public int IdRole { get; set; }

        [ForeignKey("IdRole")]
        public Role? Role { get; set; }

        [ForeignKey("MatriculeCollaborateur")]
        public Collaborateur? Collaborateur { get; set; }       
    }
}