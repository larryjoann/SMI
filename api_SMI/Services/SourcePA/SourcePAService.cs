using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class SourcePAService : ISourcePAService
    {
        private readonly SourcePARepository _sourceRepo;
        private readonly PlanActionRepository _planActionRepo;
        private readonly ProcessusConcernePARepository _pcRepo;

        public SourcePAService(
            SourcePARepository sourceRepo,
            PlanActionRepository planActionRepo,
            ProcessusConcernePARepository pcRepo)
        {
            _sourceRepo = sourceRepo;
            _planActionRepo = planActionRepo;
            _pcRepo = pcRepo;
        }

        public IEnumerable<SourcePA> GetAll() => _sourceRepo.GetAll();

        public SourcePA? GetById(int id) => _sourceRepo.GetById(id);

        public void Add(SourcePA source)
        {
            _sourceRepo.Add(source);
        }

        public void Update(SourcePA source)
        {
            _sourceRepo.Update(source);
        }

        public void Delete(int id)
        {
            _sourceRepo.Delete(id);
        }
    }
}
