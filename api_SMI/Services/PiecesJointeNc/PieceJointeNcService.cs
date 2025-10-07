using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class PieceJointeNcService : IPieceJointeNcService
    {
        private readonly PieceJointeNcRepository _repository;

        public PieceJointeNcService(PieceJointeNcRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<PieceJointeNc> GetAll() => _repository.GetAll();

        public PieceJointeNc? GetById(int id) => _repository.GetById(id);

        public IEnumerable<PieceJointeNc> GetByNonConformite(int idNc) => _repository.GetByNonConformite(idNc);

        public void Add(PieceJointeNc piece) => _repository.Add(piece);

        public void AddRange(List<PieceJointeNc> pieces) => _repository.AddRange(pieces);

        public void Update(PieceJointeNc piece) => _repository.Update(piece);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteAll() => _repository.DeleteAll();

        public void DeleteByNonConformite(int idNc) => _repository.DeleteByNonConformite(idNc);
    }
}