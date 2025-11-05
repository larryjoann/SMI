using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class PlanActionService : IPlanActionService
    {
        private readonly PlanActionRepository _planRepo;
        private readonly ProcessusConcernePARepository _pcRepo;
        private readonly IActionService _actionService;
       

        public PlanActionService(PlanActionRepository planRepo, ProcessusConcernePARepository pcRepo, IActionService actionService)
        {
            _planRepo = planRepo;
            _pcRepo = pcRepo;
            _actionService = actionService;
        }

        public IEnumerable<PlanAction> GetAll()
        {
            // Récupère les plans et ajoute les actions liées via SourceAction (Entite = 3 -> "Plan d'action")
            var plans = _planRepo.GetAll();
            foreach (var pa in plans)
            {
                var actions = _actionService.GetByEntiteAndObject(3, pa.Id).ToList();
                // Remplit la collection Actions (navigation property)
                pa.Actions = actions;
            }
            return plans;
        }

        public PlanAction? GetById(int id)
        {
            var pa = _planRepo.GetById(id);
            if (pa == null) return null;
            pa.Actions = _actionService.GetByEntiteAndObject(3, pa.Id).ToList();
            return pa;
        }

        public void Add(PlanAction planAction)
        {
            // Ensure status default to true when adding
            planAction.Status = true;
            _planRepo.Add(planAction);
        }

        public void Update(PlanAction planAction)
        {
            // Remove existing processus_concerne entries for this plan action, if any
            var existing = _pcRepo.GetAll().Where(pc => pc.IdPA == planAction.Id).ToList();
            foreach (var pc in existing)
                _pcRepo.Delete(pc.Id);

            _planRepo.Update(planAction);
        }

        public void Delete(int id)
        {
            // Delete related processus_concerne entries then delete the plan action
            var pcs = _pcRepo.GetAll().Where(pc => pc.IdPA == id).ToList();
            foreach (var pc in pcs)
                _pcRepo.Delete(pc.Id);

            _planRepo.Delete(id);
        }
    }
}
