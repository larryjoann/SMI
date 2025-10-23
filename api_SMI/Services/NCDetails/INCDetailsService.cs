using api_SMI.Models;

namespace api_SMI.Services
{
    public interface INCDetailsService
    {
        IEnumerable<NCDetails> GetAll();
        NCDetails GetDetails(int id);
        void Draft(NCDetails details);

        void Declare(NCDetails details);

        void Archiver(int ncId);

        void DraftToDeclare(NCDetails details);

        void Update(NCDetails details);

        IEnumerable<NCDetails> GetDrafts();

        IEnumerable<NCDetails> GetDeclare();

        void Qualifier(NCDetails details, int idStatusNc);

        void UpdateCausesNc(int idNc, List<CauseNc> causes);

    }
}