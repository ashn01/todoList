using System.Collections.Generic;
using TodoListWeb.Models;

namespace TodoListWeb.Data.Repositories
{
    public interface ICategoryRepository
    {
        void AddCategory(Category category);
        void Delete(Category category);
        void Edit(Category category);
        IEnumerable<Category> GetAllCategoriesById(string id);
        public Category GetCategory(int id);
        void Save();
    }
}