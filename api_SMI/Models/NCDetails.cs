using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_SMI.Models
{
    public class NCDetails : IValidatableObject
    {
        public NonConformite NC { get; set; }
        public List<PieceJointeNc> PiecesJointes { get; set; } = new();
        public List<ProcessusConcerneNc> ProcessusConcerne { get; set; } = new();
        public List<CauseNc> Causes { get; set; } = new();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (ProcessusConcerne == null || ProcessusConcerne.Count == 0)
            {
                yield return new ValidationResult(
                    "La liste des processus concernés est obligatoire et ne peut pas être vide.",
                    new[] { nameof(ProcessusConcerne) }
                );
            }
        }
    }
}