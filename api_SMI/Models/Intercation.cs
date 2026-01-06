using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Intercation")]
    public class Intercation
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_processus")]
        public int IdProcessus { get; set; }

        [ForeignKey("IdProcessus")]
        [InverseProperty("Intercations")]
        [JsonIgnore]
        public Processus? Processus { get; set; }

        [Required]
        [Column("id_processus_interagi")]
        public int IdProcessusInteragi { get; set; }

        //[ForeignKey("IdProcessusInteragi")]
        //[InverseProperty("Intercations")]
        //[JsonIgnore]
       // public Processus? ProcessusInteragi { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }
    }
}