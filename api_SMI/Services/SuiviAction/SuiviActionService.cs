using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class SuiviActionService : ISuiviActionService
    {
        private readonly SuiviActionRepository _repository;
        private readonly ActionRepository _actionRepository;

        public SuiviActionService(SuiviActionRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<SuiviAction> GetAll() => _repository.GetAll();

        public SuiviAction? GetById(int id) => _repository.GetById(id);

        public void Add(SuiviAction suivi)
        {
            suivi.DateSuivi = DateTime.Now;
            _repository.Add(suivi);
        }

        public void AddRange(List<SuiviAction> suivis)
        {
            // Set DateSuivi for each item if not already set, then delegate to repository
            foreach (var s in suivis)
            {
                if (s.DateSuivi == default)
                {
                    s.DateSuivi = DateTime.Now;
                }
            }
            _repository.AddRange(suivis);
        }

        public void Update(SuiviAction suivi)
        {
            _repository.Update(suivi);
        }

        public void Delete(int id)
        {
            _repository.Delete(id);
        }
    }
}
