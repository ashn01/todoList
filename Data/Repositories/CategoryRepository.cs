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
        public Category GetCategory(int id)
        {
            var result = _context.Categories.SingleOrDefault(l => id == (l.ID));
            return result;
        }
        public IEnumerable<Category> GetAllCategoriesAndTodosById(string id)
        {
            var result = _context.Categories.Where(l => id.Contains(l.Owner)).ToList();
            return result;
        }

        public IEnumerable<Category> GetAllCategoriesById(string id)
        {
            var result = _context.Categories.Where(l => id.Contains(l.Owner)).ToList();
            return result;
        }
        public void Edit(Category category)
        {
            _context.Categories.Update(category);
        }

        public void Delete(Category category)
        {
            _context.Categories.Remove(category);
        }

        public void DeleteWithTodos(Category category)
        {
            // delete todos
            _context.Todos.RemoveRange(_context.Todos.Where(x => x.CategoryId == category.ID));
            Delete(category);
        }
    }
}
