using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoListWeb.Models;

namespace TodoListWeb.ViewModels
{
    public class NewCategoryModel
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string Owner { get; set; }
        public List<NewTodoModel> todos { get; set; }
    }
}
