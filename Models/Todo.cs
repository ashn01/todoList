using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TodoListWeb.Models
{
    public class Todo
    {

        public int ID { get; set; }
        public string TodoName { get; set; }
        public string TodoDescription { get; set; }
        public DateTimeOffset TodoDeadline { get; set; }
        public bool TodoCompleted { get; set; }
        public int CategoryId { get; set; }

    }
}
