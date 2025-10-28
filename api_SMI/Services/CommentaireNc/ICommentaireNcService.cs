using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ICommentaireNcService
    {
        IEnumerable<CommentaireNc> GetAll();
        CommentaireNc? GetById(int id);
        IEnumerable<CommentaireNc> GetByNc(int idNc);
        void Add(CommentaireNc entity);
        void Update(CommentaireNc entity);
        void Delete(int id);
    }
}
