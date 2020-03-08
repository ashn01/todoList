using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TodoListWeb.ViewModels
{
    public class ResetPasswordModel
    {

        [Required]
        public string Password { get; set; }
        public string id { get; set; }
        public string token { get; set; }
    }
}
