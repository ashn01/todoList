using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using TodoListWeb.Models;

namespace TodoListWeb.ViewModels
{
    public class NewTodoModel
    {
        public int ID { get; set; }
        public string TodoName { get; set; }
        public string TodoDescription { get; set; }
        public DateTimeOffset TodoDeadline { get; set; }
        public bool TodoCompleted { get; set; }

        [Required]
        public int NewCategoryId { get; set; }
        public NewCategory NewCategory { get; set; }
    }
}
