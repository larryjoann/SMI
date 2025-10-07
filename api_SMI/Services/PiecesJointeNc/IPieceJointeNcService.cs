using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IPieceJointeNcService
    {
        IEnumerable<PieceJointeNc> GetAll();
        PieceJointeNc? GetById(int id);
        IEnumerable<PieceJointeNc> GetByNonConformite(int idNc);
        void Add(PieceJointeNc piece);
        void AddRange(List<PieceJointeNc> pieces);
        void Update(PieceJointeNc piece);
        void Delete(int id);
        void DeleteAll();

        void DeleteByNonConformite(int idNc);
    
    }
}