using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoListWeb.Models;

namespace TodoListWeb.Data.Repositories
{
    public class TodoRepository : ITodoRepository
    {
        private readonly TodoListContext _context;

        public TodoRepository(TodoListContext context)
        {
            _context = context;
        }

        public void AddTodo(Todo todo)
        {
            _context.Todos.Add(todo);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
        public Todo GetTodo(int id)
        {
            var result = _context.Todos.SingleOrDefault(l => id == (l.ID));
            return result;
        }
        public IEnumerable<Todo> GetAllTodosById(int id)
        {
            var result = _context.Todos.Where(l => id == l.CategoryId).ToList();
            return result;
        }
        public void Edit(Todo todo)
        {
            _context.Todos.Update(todo);
        }

        public void Delete(Todo todo)
        {
            _context.Todos.Remove(todo);
        }
    }
}
