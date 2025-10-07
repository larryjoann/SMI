using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_SMI.Models
{
    [Table("Piece_jointe_nc")]
    public class PieceJointeNc
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_nc")]
        public int IdNc { get; set; }

        [Required]
        [Column("nom_fichier")]
        public string NomFichier { get; set; } = string.Empty;

        [Required]
        [Column("chemin_fichier")]
        public string CheminFichier { get; set; } = string.Empty;
    }
}