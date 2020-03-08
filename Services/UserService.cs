using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TodoListWeb.Data;
using TodoListWeb.Helpers;
using TodoListWeb.Models;

namespace TodoListWeb.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
        string getUserId(string username);
        public ClaimsPrincipal Validate(string token);
        User Create(User user, string password);
        User UpdateUser(User user, string curPassword, string newPassword);
        void DeleteUser(User user);
        User ConfirmEmail(string userId);
        User ResetPassword(string userId, string password);
        bool CheckConfirmed(string username);
    }
    public class UserService : IUserService
    {
        private readonly AppSettings _appSettings;
        private readonly TodoListContext _context;

        public UserService(IOptions<AppSettings> appSettings,
                                    TodoListContext context)
        {
            _appSettings = appSettings.Value;
            _context = context;
        }

        public User Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            var user = _context.Users.SingleOrDefault(x=>x.Email == username);
            // return null if user not found
            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;


            return user;
        }

        public string getUserId(string username)
        {
            if (string.IsNullOrEmpty(username))
                return null;

            var user = _context.Users.SingleOrDefault(x => x.Email == username);

            if (user == null)
                return null;

            return user.Id;
        }

        public ClaimsPrincipal Validate(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

            try
            {
                var validations = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                return tokenHandler.ValidateToken(token,validations, out var tokenSecure);
            }
            catch
            {
                return null;
            }
            //var tokenHandler = new JwtSecurityTokenHandler();
            //var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

            //try
            //{
            //    tokenHandler.ValidateToken(token, new TokenValidationParameters
            //    {
            //        ValidateIssuer = false,
            //        ValidateAudience = false,
            //        ValidateIssuerSigningKey = true,
            //        IssuerSigningKey = new SymmetricSecurityKey(key)
            //    }, out SecurityToken validatedToken);
            //    return true;
            //}
            //catch
            //{
            //    return false;
            //}
        }

        public User Create(User user, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
                throw new Exception("Password is required");

            if (_context.Users.Any(x => x.Email == user.Email))
                throw new Exception("Username \"" + user.Email + "\" is already taken");

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _context.Users.Add(user);
            _context.SaveChanges();

            // Add default data
            var newUser = _context.Users.SingleOrDefault(x => x.Email == user.Email);
            _context.NewCategories.Add(new NewCategory { CategoryName = "My Category" , Owner=newUser.Id});
            _context.SaveChanges();

            var addedCategory = _context.NewCategories.SingleOrDefault(c => c.Owner == newUser.Id);
            DateTimeOffset today = DateTimeOffset.Now;
            List<NewTodo> todos = new List<NewTodo>()
            {
                new NewTodo () { TodoName="Welcome to Doo-bido",TodoCompleted=false, NewCategoryId=addedCategory.ID, TodoDeadline=today },
                new NewTodo () { TodoName="You can add new category by clicking +",TodoCompleted=false, NewCategoryId=addedCategory.ID, TodoDeadline=today },
                new NewTodo () { TodoName="You also can add new todos. Type todo title and Click +",TodoCompleted=false, NewCategoryId=addedCategory.ID, TodoDeadline=today },
                new NewTodo () { TodoName="You can modify category name. Double click on it",TodoCompleted=false, NewCategoryId=addedCategory.ID, TodoDeadline=today },
                new NewTodo () { TodoName="You can modify todos. Double click on it or edit button",TodoCompleted=false, NewCategoryId=addedCategory.ID, TodoDeadline=today },
                new NewTodo () { TodoName="Delayed todo will be  noticeable",TodoCompleted=false, NewCategoryId=addedCategory.ID, TodoDeadline=today.AddDays(-1)}
            };
            _context.NewTodos.AddRange(todos);

            _context.SaveChanges();

            return user;
        }

        public User UpdateUser(User user, string curPassword, string newPassword)
        {
            if (user == null)
                throw new Exception("Wrong User ID");

            var u = _context.Users.SingleOrDefault(x => x.Email == user.Email);

            u.FirstName = user.FirstName == null ? u.FirstName : user.FirstName;
            u.LastName = user.LastName == null ? u.LastName : user.LastName;

            // check password
            if (newPassword != null)
            {
                var ret = Authenticate(user.Email, curPassword);
                if (ret == null)
                    throw new Exception("Wrong password");

                // correct password and hashing new password
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(newPassword, out passwordHash, out passwordSalt);

                u.PasswordHash = passwordHash;
                u.PasswordSalt = passwordSalt;
            }

            _context.Users.Update(u);
            _context.SaveChanges();

            return u;
        }

        public void DeleteUser(User user)
        {
            if (user == null)
                throw new Exception("Wrong User ID");

            var u = _context.Users.SingleOrDefault(x => x.Email == user.Email);

            // remove all categories
            _context.NewCategories.RemoveRange(_context.NewCategories.Where(x => x.Owner == u.Id));

            _context.Users.Remove(u);
            _context.SaveChanges();
        }

        public User ConfirmEmail(string userId)
        {
            // validation
            if (string.IsNullOrWhiteSpace(userId))
                throw new Exception("Wrong User ID");

            if (!_context.Users.Any(x => x.Id == userId))
                throw new Exception("User Not Found");

            var user = _context.Users.SingleOrDefault(x => x.Id == userId);
            user.EmailConfirmed = true;

            _context.Users.Update(user);
            _context.SaveChanges();

            return user;
        }

        public User ResetPassword(string userId, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(userId))
                throw new Exception("Wrong User ID");

            if (!_context.Users.Any(x => x.Id == userId))
                throw new Exception("User Not Found");

            var user = _context.Users.SingleOrDefault(x => x.Id == userId);

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _context.Users.Update(user);
            _context.SaveChanges();

            return user;
        }

        public bool CheckConfirmed(string username)
        {
            // validation
            if (string.IsNullOrWhiteSpace(username))
                throw new Exception("Wrong User ID");

            if (!_context.Users.Any(x => x.Email == username))
                throw new Exception("User Not Found");

            var user = _context.Users.SingleOrDefault(x => x.Email == username);

            if (user.EmailConfirmed)
                return true;
            else
                return false;
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
    }
}
