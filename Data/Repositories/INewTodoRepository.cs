using System.Collections.Generic;
using TodoListWeb.Models;

namespace TodoListWeb.Data.Repositories
{
    public interface INewTodoRepository
    {
        void AddTodo(NewTodo todo);
        void Delete(NewTodo todo);
        void DeleteAllById(int id);
        void Edit(NewTodo todo);
        IEnumerable<NewTodo> GetAllTodosById(int id);
        NewTodo GetTodo(int id);
        void Save();
    }
}