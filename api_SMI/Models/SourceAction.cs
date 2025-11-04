using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Source_action")]
    public class SourceAction
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("id_action")]
        public int IdAction { get; set; }

        [ForeignKey("IdAction")]
        [JsonIgnore]
        public Action? Action { get; set; }

        [Column("id_entite")]
        public int? IdEntite { get; set; }

        [ForeignKey("IdEntite")]
        public Entite? Entite { get; set; }

        // id_objet is kept as an integer because target table/class isn't specified.
        [Column("id_objet")]
        public int? IdObjet { get; set; }
    }
}
