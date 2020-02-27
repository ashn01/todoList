using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoListWeb.Models
{
    public class Todo
    {

        public int Id { get; set; }
        public string TodoName { get; set; }
        public string TodoDescription { get; set; }
        public DateTime TodoDeadline { get; set; }
        public bool TodoCompleted { get; set; }
        public Category Category { get; set; }

    }
}
