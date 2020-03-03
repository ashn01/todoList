using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoListWeb.Models
{
    public class NewTodo
    {
        public int ID { get; set; }
        public string TodoName { get; set; }
        public string TodoDescription { get; set; }
        public DateTimeOffset TodoDeadline { get; set; }
        public bool TodoCompleted { get; set; }

        public int NewCategoryId { get; set; }
    }
}
