using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Activite")]
    public class Activite
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_processus")]
        public int IdProcessus { get; set; }

        [ForeignKey("IdProcessus")]
        [JsonIgnore]
        public Processus? Processus { get; set; }

        [Column("processus_fournisseur")]
        public string? ProcessusFournisseur { get; set; }

        [Column("element_entrante")]
        public string? ElementEntrante { get; set; }

        [Column("processus_client")]
        public string? ProcessusClient { get; set; }

        [Column("element_sortante")]
        public string? ElementSortante { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }
    }
}