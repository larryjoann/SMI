using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class PlanActionService : IPlanActionService
    {
        private readonly PlanActionRepository _planRepo;
        private readonly ProcessusConcernePARepository _pcRepo;

        public PlanActionService(PlanActionRepository planRepo, ProcessusConcernePARepository pcRepo)
        {
            _planRepo = planRepo;
            _pcRepo = pcRepo;
        }

        public IEnumerable<PlanAction> GetAll() => _planRepo.GetAll();

        public PlanAction? GetById(int id) => _planRepo.GetById(id);

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
