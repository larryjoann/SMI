using api_SMI.Models;
using ActionModel = api_SMI.Models.Action;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class ActionService : IActionService
    {
        private readonly ActionRepository _repository;

        public ActionService(ActionRepository repository)
        {
            _repository = repository;
        }
        public IEnumerable<ActionModel> GetAll() => _repository.GetAll();
        public ActionModel? GetById(int id) => _repository.GetById(id);
        public IEnumerable<ActionModel> GetByEntite(int entiteId) => _repository.GetByEntite(entiteId);
        public IEnumerable<ActionModel> GetByEntiteAndObject(int entiteId, int objetId) => _repository.GetByEntiteAndObject(entiteId, objetId);
        public void Add(ActionModel action)
        {
            action.IdStatusAction = 1; // Default status
            action.Status = true;
            _repository.Add(action);
        }

        public void Update(ActionModel action)
        {
            _repository.Update(action);
        }
        
        public void UpdateStatus(int idAction, int statusId)
        {
            ActionModel action = _repository.GetById(idAction);
            action.IdStatusAction = statusId;
            _repository.Update(action);
        }

        public void Delete(int id)
        {
            ActionModel action = _repository.GetById(id);
            action.Status = false;
            _repository.Update(action);
        }
        
    }
}
