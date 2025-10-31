using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.Generic;

namespace api_SMI.Models
{
    [Table("Processus")]
    public class Processus
    {
        [Key] 
        [Column("id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Le nom du processus est obligatoire.")]
        [Column("nom")]
        public string? Nom { get; set; }

        [Required(ErrorMessage = "Le sigle est obligatoire.")]
        [Column("sigle")]
        public string? Sigle { get; set; }

        [BindRequired]
        [Required(ErrorMessage = "La catégorie du processus est obligatoire.")]
        [Column("id_categorie_processus")]
        public int? IdCategorieProcessus { get; set; }

        [ForeignKey("IdCategorieProcessus")]
        public CategorieProcessus? CategorieProcessus { get; set; }

        [Column("contexte")]
        public string? Contexte { get; set; }

        [Column("finalite")]
        public string? Finalite { get; set; }

        [Column("status")]
        public bool? Status { get; set; }

    // Navigation vers plusieurs pilotes
    public ICollection<Pilote> Pilotes { get; set; } = new List<Pilote>();

    // Navigation vers plusieurs copilotes
    public ICollection<Copilote> Copilotes { get; set; } = new List<Copilote>();

    // Navigation vers les années de validité
    public ICollection<ValiditeProcessus> Validites { get; set; } = new List<ValiditeProcessus>();
    }
}