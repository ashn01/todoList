using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoListWeb.Models;

namespace TodoListWeb.Data.Repositories
{
    public class NewTodoRepository : INewTodoRepository
    {
        private readonly TodoListContext _context;

        public NewTodoRepository(TodoListContext context)
        {
            _context = context;
        }

        public void AddTodo(NewTodo todo)
        {
            _context.NewTodos.Add(todo);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
        public NewTodo GetTodo(int id)
        {
            var result = _context.NewTodos.SingleOrDefault(l => id == (l.ID));

            return result;
        }
        public IEnumerable<NewTodo> GetAllTodosById(int id)
        {
            var result = _context.NewTodos.Where(l => id == l.NewCategoryId).ToList();
            return result;
        }
        public void Edit(NewTodo todo)
        {
            _context.NewTodos.Update(todo);
        }

        public void Delete(NewTodo todo)
        {
            _context.NewTodos.Remove(todo);
        }

        public void DeleteAllById(int id)
        {
            _context.NewTodos.RemoveRange(_context.NewTodos.Where(x => x.NewCategoryId == id));
        }
    }
}
