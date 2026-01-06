using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class ProcessusService : IProcessusService
    {
        private readonly ProcessusRepository _repository;
       private readonly ResponsableProcessusRepository _responsableProcessusRepository;
       private readonly IntercationRepository _intercationRepository;
       private readonly PartieInteresseAttenteRepository _partieInteresseAttenteRepository;
       private readonly RessourceProcessusRepository _ressourceProcessusRepository;
       private readonly ActiviteRepository _activiteRepository;
    
       

        public ProcessusService(
            ProcessusRepository repository,
            ResponsableProcessusRepository responsableProcessusRepository,
            IntercationRepository intercationRepository,
            PartieInteresseAttenteRepository partieInteresseAttenteRepository,
            ActiviteRepository activiteRepository,
            RessourceProcessusRepository ressourceProcessusRepository)
        {
            _repository = repository;
            _responsableProcessusRepository = responsableProcessusRepository;
            _intercationRepository = intercationRepository;
            _partieInteresseAttenteRepository = partieInteresseAttenteRepository;
            _activiteRepository = activiteRepository;
            _ressourceProcessusRepository = ressourceProcessusRepository;
        }

        public IEnumerable<Processus> GetAll() => _repository.GetAll();

        public Processus? GetById(int id) => _repository.GetById(id);

        public void Add(Processus processus)
        {
            if (processus == null) throw new System.ArgumentNullException(nameof(processus));
            processus.Status = true;
            _repository.Add(processus);
        }

        public void Update(Processus processus)
        {
            if (processus == null) throw new System.ArgumentNullException(nameof(processus));

            // delete old responsables if repository is available
            if (_responsableProcessusRepository != null)
            {
                _responsableProcessusRepository.DeleteByProcessus(processus.Id);
            }

            if (_intercationRepository != null)
            {
                _intercationRepository.DeleteByProcessus(processus.Id);
            }

            if (_partieInteresseAttenteRepository != null)
            {
                _partieInteresseAttenteRepository.DeleteByProcessus(processus.Id);
            }

            if (_ressourceProcessusRepository != null)
            {
                _ressourceProcessusRepository.DeleteByProcessus(processus.Id);
            }

            if (_activiteRepository != null)
            {
                _activiteRepository.DeleteByProcessus(processus.Id);
            }
            _repository.Update(processus);
        }

        public void Delete(int id)
        {
            var processus = _repository.GetById(id);
            if (processus == null) return;

            // remove related responsables to keep data consistent
            if (_responsableProcessusRepository != null)
            {
                _responsableProcessusRepository.DeleteByProcessus(id);
            }

            processus.Status = false;
            _repository.Update(processus);
        }
    }
}