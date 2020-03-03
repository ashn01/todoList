using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoListWeb.Models;
using TodoListWeb.ViewModels;

namespace TodoListWeb.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<RegisterModel, User>();
            CreateMap<CategoryModel, Category>();
            CreateMap<Category, CategoryModel>();

            CreateMap<NewCategoryModel, NewCategory>();
            CreateMap<NewCategory, NewCategoryModel>();

            CreateMap<TodoModel, Todo>();
            CreateMap<Todo, TodoModel>();

            CreateMap<NewTodoModel, NewTodo>();
            CreateMap<NewTodo, NewTodoModel>();
        }
    }
}
