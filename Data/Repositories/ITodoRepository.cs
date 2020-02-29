using System.Collections.Generic;
using TodoListWeb.Models;

namespace TodoListWeb.Data.Repositories
{
    public interface ITodoRepository
    {
        void AddTodo(Todo todo);
        void Delete(Todo todo);
        void Edit(Todo todo);
        IEnumerable<Todo> GetAllTodosById(int id);
        Todo GetTodo(int id);
        void Save();
        public void DeleteAllById(int id);
    }
}