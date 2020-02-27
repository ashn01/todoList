using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoListWeb.Models;

namespace TodoListWeb.Data.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly TodoListContext _context;

        public CategoryRepository(TodoListContext context)
        {
            _context = context;
        }

        public void AddCategory(Category category)
        {
            _context.Categories.Add(category);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public IEnumerable<Category> GetAllCategoriesById(string id)
        {
            var result = _context.Categories.Where(l => id.Contains(l.Owner)).ToList();
            return result;
        }
        public void Edit(Category student)
        {
            _context.Categories.Update(student);
        }

        public void Delete(Category student)
        {
            _context.Categories.Remove(student);
        }
    }
}
