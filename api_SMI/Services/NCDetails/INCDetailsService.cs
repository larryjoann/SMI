using api_SMI.Models;

namespace api_SMI.Services
{
    public interface INCDetailsService
    {
        IEnumerable<NCDetails> GetAll();
        NCDetails GetDetails(int id);
        void Draft(NCDetails details , string matricule);

        void Declare(NCDetails details , string matricule);

        void Archiver(int ncId , string matricule);
        void Restorer(int ncId , string matricule);

        void DraftToDeclare(NCDetails details , string matricule);

        void Update(NCDetails details , string matricule);

        IEnumerable<NCDetails> GetDrafts(string matricule_emetteur);

        IEnumerable<NCDetails> GetDeclare(string matricule_emetteur);
        IEnumerable<NCDetails> GetArchived(string matricule_emetteur);

        IEnumerable<NCDetails> GetAllByMatricule(string matricule_emetteur);


        void Qualifier(NCDetails details, int idStatusNc , string matricule);

        void UpdateCausesNc(int idNc, List<CauseNc> causes , string matricule);

    }
}