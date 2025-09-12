using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Role_permission")]
    public class RolePermission
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("id_role")]
        public int IdRole { get; set; }

        [Column("id_permission")]
        public int IdPermission { get; set; }
    }
}