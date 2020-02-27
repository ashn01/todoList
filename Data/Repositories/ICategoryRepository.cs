using System.Collections.Generic;
using TodoListWeb.Models;

namespace TodoListWeb.Data.Repositories
{
    public interface ICategoryRepository
    {
        void AddCategory(Category category);
        void Delete(Category student);
        void Edit(Category student);
        IEnumerable<Category> GetAllCategoriesById(string id);
        void Save();
    }
}