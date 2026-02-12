using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api_SMI.Models
{
    [Table("Mesure_indicateur")]
    public class MesureIndicateur
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_cible_indicateur")]
        public int IdCibleIndicateur { get; set; }

        [ForeignKey(nameof(IdCibleIndicateur))]
        //[JsonIgnore]
        public CibleIndicateur? CibleIndicateur { get; set; }

        [Required]
        [Column("id_indicateur")]
        public int IdIndicateur { get; set; }

        [ForeignKey(nameof(IdIndicateur))]
        [JsonIgnore]
        public Indicateur? Indicateur { get; set; }

        [Column("date_mesure")]
        public DateTime DateMesure { get; set; }

        [Required]
        [Column("annee")]
        public int Annee { get; set; }

        [Required]
        [Column("periode")]
        public int Periode { get; set; }

        [Required]
        [Column("valeur")]
        public double Valeur { get; set; }

        [Column("commentaire")]
        public string? Commentaire { get; set; }

        /// <summary>
        /// Propriété calculée qui détermine si la cible est atteinte
        /// Retourne true si la valeur se situe entre la cible min et max
        /// </summary>
        [NotMapped]
        public bool EstAtteint
        {
            get
            {
                if (CibleIndicateur == null)
                    return false;

                if(CibleIndicateur.CibleOptimale.HasValue && Valeur == CibleIndicateur.CibleOptimale)
                    return true;

                if(CibleIndicateur.CibleMin.HasValue && CibleIndicateur.CibleMax.HasValue && Valeur < CibleIndicateur.CibleMin && Valeur > CibleIndicateur.CibleMax)
                    return false;

                if (CibleIndicateur.CibleMin.HasValue && Valeur < CibleIndicateur.CibleMin)
                    return false;

                if (CibleIndicateur.CibleMax.HasValue && Valeur > CibleIndicateur.CibleMax)
                    return false;

                return true;
            }
        }
    }
}