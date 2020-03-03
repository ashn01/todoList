using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoListWeb.Models;

namespace TodoListWeb.Data.Repositories
{
    public class NewCategoryRepository : INewCategoryRepository
    {
        private readonly TodoListContext _context;

        public NewCategoryRepository(TodoListContext context)
        {
            _context = context;
        }

        public void AddCategory(NewCategory category)
        {
            _context.NewCategories.Add(category);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
        public NewCategory GetCategory(int id)
        {
            var result = _context.NewCategories.SingleOrDefault(l => id == (l.ID));
            return result;
        }
        public IEnumerable<NewCategory> GetAllCategoriesById(string id)
        {
            var result = _context.NewCategories.Where(l => id.Contains(l.Owner)).ToList();
    

            foreach(var row in result)
            {
                var todos = _context.NewTodos.Where(t => t.NewCategoryId == row.ID).ToList();
                row.todos = todos;
            }

            return result;
        }
        public void Edit(NewCategory category)
        {
            _context.NewCategories.Update(category);
        }

        public void Delete(NewCategory category)
        {
            _context.NewCategories.Remove(category);
        }

        public void DeleteWithTodos(NewCategory category)
        {
            // delete todos
            //_context.Todos.RemoveRange(_context.Todos.Where(x => x.CategoryId == category.ID));
            Delete(category);
        }
    }
}
