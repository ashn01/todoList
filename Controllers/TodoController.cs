using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoListWeb.Data.Repositories;
using TodoListWeb.Models;
using TodoListWeb.Services;
using TodoListWeb.ViewModels;

namespace TodoListWeb.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly INewTodoRepository _newTodoRepository;
        private IMapper _mapper;
        private IUserService _userService;
        public TodoController(IMapper mapper,
                              IUserService userService,
                              INewTodoRepository newTodoRepository)
        {
            _mapper = mapper;
            _userService = userService;
            _newTodoRepository = newTodoRepository;
        }

        [AllowAnonymous]
        [HttpPost("add")]
        public IActionResult Create([FromBody]NewTodoModel model)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token) != null)
            {
                var todo = _mapper.Map<NewTodo>(model);

                try
                {
                    _newTodoRepository.AddTodo(todo);
                    _newTodoRepository.Save();

                    IEnumerable<NewTodo> todoList = _newTodoRepository.GetAllTodosById(model.NewCategoryId);

                    var todos = _mapper.Map<IEnumerable<NewTodo>>(todoList);

                    return Ok(new { todos });
                }
                catch (Exception ex)
                {
                    // return error message if there was an exception
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
                return Unauthorized(new { message = "Invalid Token" });
        }

        [AllowAnonymous]
        [HttpPost("deleteById")]
        public IActionResult Delete([FromBody]NewTodoModel model) // delete Todo by id
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token) != null)
            {
                NewTodo ret = _newTodoRepository.GetTodo(model.ID);
                if (ret != null)
                {
                    try
                    {
                        _newTodoRepository.Delete(ret);
                        _newTodoRepository.Save();

                        IEnumerable<NewTodo> todoList = _newTodoRepository.GetAllTodosById(model.NewCategoryId);

                        var todos = _mapper.Map<IEnumerable<NewTodo>>(todoList);

                        return Ok(new { todos });
                    }
                    catch (Exception ex)
                    {
                        // return error message if there was an exception
                        return BadRequest(new { message = ex.Message });
                    }
                }
                else
                    return BadRequest(new { message = "Item Not Found" });
            }
            else
                return Unauthorized(new { message = "Invalid Token" });
        }

        [AllowAnonymous]
        [HttpPost("getById")]
        public IActionResult GetById([FromBody]NewCategoryModel model)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token) != null)
            {
                try
                {
                    IEnumerable<NewTodo> todoList = _newTodoRepository.GetAllTodosById(model.Id);

                    var todos = _mapper.Map<IEnumerable<NewTodo>>(todoList);

                    return Ok(new { todos });
                }
                catch (Exception ex)
                {
                    // return error message if there was an exception
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
                return Unauthorized(new { message = "Invalid Token" });
        }

        [AllowAnonymous]
        [HttpPost("editById")]
        public IActionResult Edit([FromBody]NewTodoModel model) // delete Category by category id
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token) != null)
            {
                try
                {
                    var todo = _mapper.Map<NewTodo>(model);
                    _newTodoRepository.Edit(todo);
                    _newTodoRepository.Save();

                    IEnumerable<NewTodo> todoList = _newTodoRepository.GetAllTodosById(model.NewCategoryId);

                    var todos = _mapper.Map<IEnumerable<NewTodo>>(todoList);

                    return Ok(new { todos });

                }
                catch (Exception ex)
                {
                    // return error message if there was an exception
                    return BadRequest(new { message = ex.Message });
                }
            }
            else
                return Unauthorized(new { message = "Invalid Token" });
        }
    }
}