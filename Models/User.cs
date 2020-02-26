using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TodoListWeb.Models
{
    public class User : IdentityUser
    {

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Token { get; set; }
        [MaxLength(64)]
        public byte[] PasswordHash { get; set; }
        [MaxLength(128)]
        public byte[] PasswordSalt { get; set; }
    }
}
