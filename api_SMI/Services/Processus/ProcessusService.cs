using api_SMI.Models;
using api_SMI.Repositories;

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
            processus.Status = true;
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
            var pilotes = _piloteRepository.GetByProcessus(id);
            foreach (var pilote in pilotes)
                _piloteRepository.Delete(pilote.Id);

            var copilotes = _copiloteRepository.GetByProcessus(id);
            foreach (var copilote in copilotes)
                _copiloteRepository.Delete(copilote.Id);

            var processus = _repository.GetById(id);
            processus.Status = false;
            _repository.Update(processus);
        }
    }
}