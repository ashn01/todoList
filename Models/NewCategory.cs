using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoListWeb.Models
{
    public class NewCategory
    {
        public int ID { get; set; }
        public string CategoryName { get; set; }
        public string Owner { get; set; }

        public virtual ICollection<NewTodo> todos { get; set; }
    }
}
