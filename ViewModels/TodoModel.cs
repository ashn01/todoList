using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TodoListWeb.ViewModels
{
    public class TodoModel
    {
        public int ID { get; set; }
        [Required]
        public string TodoName { get; set; }
        public string TodoDescription { get; set; }
        public DateTime TodoDeadline { get; set; }
        [Required]
        public bool TodoCompleted { get; set; }
        [Required]
        public int CategoryId { get; set; }
    }
}
