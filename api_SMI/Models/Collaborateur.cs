using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Collaborateur")]
    public class Collaborateur
    {
        [Key] 
        [Column("matricule")]
        public string? Matricule { get; set; }
        
        [Column("nom_complet")]
        public string? NomComplet { get; set; }
        
        [Column("nom_affichage")]
        public string? NomAffichage { get; set; }

        [Column("departement")]
        public string? Departement { get; set; }

        [Column("poste")]
        public string? Poste { get; set; }

        [Column("courriel")]
        public string? Courriel { get; set; }

        [Column("telephone")]
        public string? Telephone { get; set; }
        
        [Column("etat")]
        public int Etat { get; set; }
    }
}