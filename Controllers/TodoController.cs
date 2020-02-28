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
        private readonly ITodoRepository _todoRepository;
        private IMapper _mapper;
        private IUserService _userService;
        public TodoController(IMapper mapper,
                              IUserService userService,
                              ITodoRepository todoRepository)
        {
            _mapper = mapper;
            _userService = userService;
            _todoRepository = todoRepository;
        }

        [AllowAnonymous]
        [HttpPost("add")]
        public IActionResult Create([FromBody]TodoModel model)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token))
            {
                var todo = _mapper.Map<Todo>(model);

                try
                {
                    _todoRepository.AddTodo(todo);
                    _todoRepository.Save();
                    return Ok();
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
        [HttpPost("getById")]
        public IActionResult GetById([FromBody]CategoryModel model)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token))
            {
                try
                {
                    IEnumerable<Todo> ret = _todoRepository.GetAllTodosById(model.Id);

                    var todos = _mapper.Map<IEnumerable<Todo>>(ret);

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