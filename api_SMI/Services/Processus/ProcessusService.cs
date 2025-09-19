using api_SMI.Models;
using api_SMI.Repositories;
using System.Text.Json;

namespace api_SMI.Services
{
    public class ProcessusService : IProcessusService
    {
        private readonly ProcessusRepository _repository;
        private readonly PiloteRepository _piloteRepository;
        private readonly CopiloteRepository _copiloteRepository;

        public ProcessusService(
            ProcessusRepository repository,
            PiloteRepository piloteRepository,
            CopiloteRepository copiloteRepository)
        {
            _repository = repository;
            _piloteRepository = piloteRepository;
            _copiloteRepository = copiloteRepository;
        }

        public IEnumerable<Processus> GetAll() => _repository.GetAll();

        public Processus? GetById(int id) => _repository.GetById(id);

        public void Add(Processus processus)
        {
            _repository.Add(processus);
        }

        public void Update(Processus processus)
        {
            _piloteRepository.DeleteByProcessus(processus.Id);
            _copiloteRepository.DeleteByProcessus(processus.Id);
           
           _repository.Update(processus);
        }

        public void Delete(int id)
        {
            // Supprimer les pilotes et copilotes liés
            var pilotes = _piloteRepository.GetByProcessus(id);
            foreach (var pilote in pilotes)
                _piloteRepository.Delete(pilote.Id);

            var copilotes = _copiloteRepository.GetByProcessus(id);
            foreach (var copilote in copilotes)
                _copiloteRepository.Delete(copilote.Id);

            _repository.Delete(id);
        }
    }
}