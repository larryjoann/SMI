using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace api_SMI.Models
{
    [Table("Type_responsable_processus")]
    public class TypeResponsableProcessus
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Le rôle est obligatoire.")]
        [Column("id_role")]
        public int IdRole { get; set; }

        [ForeignKey("IdRole")]
        public Role? Role { get; set; }

        // Navigation vers les responsables de processus
        [JsonIgnore]
        public ICollection<ResponsableProcessus> ResponsablesProcessus { get; set; } = new List<ResponsableProcessus>();
    }
}
