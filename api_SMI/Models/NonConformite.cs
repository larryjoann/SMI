using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("non_conformite")]
    public class NonConformite : IValidatableObject
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("datetime_creation")]
        public DateTime? DateTimeCreation { get; set; }

        [Column("datetime_declare")]
        public DateTime? DateTimeDeclare { get; set; }

        [Column("datetime_fait")]
        public DateTime? DateTimeFait { get; set; }

        [Column("descr")]
        public string? Descr { get; set; }

        [Column("action_curative")]
        public string? ActionCurative { get; set; }

        [Column("id_lieu")]
        public int? IdLieu { get; set; }

        [ForeignKey("IdLieu")]
        public Lieu? Lieu { get; set; }

        [Column("id_type_nc")]
        public int? IdTypeNc { get; set; }

        [ForeignKey("IdTypeNc")]
        public TypeNc? TypeNc { get; set; }

        [Column("id_status_nc")]
        public int? IdStatusNc { get; set; }
        
        [ForeignKey("IdStatusNc")]
        public StatusNc? StatusNc { get; set; }

        [Column("id_priorite_nc")]
        public int? IdPrioriteNc { get; set; }

        [ForeignKey("IdPrioriteNc")]
        public PrioriteNc? PrioriteNc { get; set; } 

        [Column("status")]
        public bool? Status { get; set; }


        // Validation personnalisée
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (DateTimeDeclare != null)
            {
                if (string.IsNullOrWhiteSpace(Descr))
                    yield return new ValidationResult("La description est obligatoire.", new[] { nameof(Descr) });

                if (IdLieu == null)
                    yield return new ValidationResult("Le lieu est obligatoire.", new[] { nameof(IdLieu) });

                if (IdTypeNc == null)
                    yield return new ValidationResult("Le type NC est obligatoire.", new[] { nameof(IdTypeNc) });

                if (IdStatusNc == null)
                    yield return new ValidationResult("Le status NC est obligatoire.", new[] { nameof(IdStatusNc) });

                if (IdPrioriteNc == null)
                    yield return new ValidationResult("La priorité NC est obligatoire.", new[] { nameof(IdPrioriteNc) });

                if (DateTimeFait == null)
                    yield return new ValidationResult("La date de réalisation est obligatoire.", new[] { nameof(DateTimeFait) });
            }
        }
    }
}