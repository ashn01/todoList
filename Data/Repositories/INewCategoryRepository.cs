using System.Collections.Generic;
using TodoListWeb.Models;

namespace TodoListWeb.Data.Repositories
{
    public interface INewCategoryRepository
    {
        void AddCategory(NewCategory category);
        void Delete(NewCategory category);
        void DeleteWithTodos(NewCategory category);
        void Edit(NewCategory category);
        IEnumerable<NewCategory> GetAllCategoriesById(string id);
        NewCategory GetCategory(int id);
        void Save();
    }
}