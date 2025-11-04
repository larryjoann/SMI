using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Suivi_action")]
    public class SuiviAction
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("id_action")]
        public int IdAction { get; set; }

        [ForeignKey("IdAction")]
        [JsonIgnore]
        public Action? Action { get; set; }

        [Column("date_suivi")]
        public DateTime? DateSuivi { get; set; }

        [Column("avancement")]
        public int? Avancement { get; set; }
    }
}
