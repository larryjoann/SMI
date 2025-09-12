using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Processus")]
    public class Processus
    {
        [Key] 
        [Column("id")]
        public int Id { get; set; }

        [Column("nom")]
        public string? Nom { get; set; }

        [Column("sigle")]
        public string? Sigle { get; set; }

        [Column("pseudo_pilote")]
        public string? PseudoPilote { get; set; }

        [Column("matricule_pilote")]
        public string? MatriculePilote { get; set; }

        [Column("pseudo_copilote")]
        public string? PseudoCopilote { get; set; }

        [Column("matricule_copilote")]
        public string? MatriculeCopilote { get; set; }

        [Column("id_categorie_processus")]
        public int IdCategorieProcessus { get; set; }

        [Column("contexte")]
        public string? Contexte { get; set; }

        [Column("finalite")]
        public string? Finalite { get; set; }
    }
}