using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoListWeb.Models;

namespace TodoListWeb.Data
{
    public class TodoListContext : IdentityDbContext<User>
    {
        public TodoListContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<NewCategory>()
                .HasMany(c => c.todos).WithOne()
                .HasForeignKey(t => t.NewCategoryId);

            //builder.Entity<NewTodo>()
            //    .HasOne(t => t.NewCategory)
            //    .WithMany(c => c.todos)
            //    .HasForeignKey(t => t.NewCategoryId)
            //    .HasConstraintName("ForeignKey_Todo_Category")
            //    .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<NewCategory> NewCategories { get; set; }
        public DbSet<NewTodo> NewTodos { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Todo> Todos { get; set; }
    }
}
