using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class TypeNcRepository
    {
        private readonly ApplicationDbContext _context;

        public TypeNcRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<TypeNc> GetAll()
            => _context.Set<TypeNc>().ToList();

        public TypeNc? GetById(int id)
            => _context.Set<TypeNc>().FirstOrDefault(t => t.Id == id);

        public void Add(TypeNc typeNc)
        {
            _context.Set<TypeNc>().Add(typeNc);
            _context.SaveChanges();
        }

        public void AddRange(List<TypeNc> typeNcs)
        {
            _context.Set<TypeNc>().AddRange(typeNcs);
            _context.SaveChanges();
        }

        public void Update(TypeNc typeNc)
        {
            _context.Set<TypeNc>().Update(typeNc);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<TypeNc>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<TypeNc>().RemoveRange(_context.Set<TypeNc>());
            _context.SaveChanges();
        }
    }
}