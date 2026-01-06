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

        // Navigation vers les responsables du processus
        public ICollection<ResponsableProcessus> ResponsablesProcessus { get; set; } = new List<ResponsableProcessus>();

        // Navigation vers les années de validité
        public ICollection<ValiditeProcessus> Validites { get; set; } = new List<ValiditeProcessus>();

        // Navigation vers les nouvelles entités liées au processus
        [InverseProperty("Processus")]
        public ICollection<Intercation> Intercations { get; set; } = new List<Intercation>();
       // public ICollection<Intercation> IntercationsInteragi { get; set; } = new List<Intercation>();
        public ICollection<RessourceProcessus> RessourcesProcessus { get; set; } = new List<RessourceProcessus>();
        public ICollection<PartieInteresseAttente> PartieInteresseAttentes { get; set; } = new List<PartieInteresseAttente>();
        public ICollection<Activite> Activites { get; set; } = new List<Activite>();
    }
} 