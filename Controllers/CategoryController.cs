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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private IMapper _mapper;
        private IUserService _userService;
        public CategoryController(ICategoryRepository categoryRepository,
                                    IMapper mapper,
                                    IUserService userService)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("getById")]
        public IActionResult GetById([FromBody]UserModel model) // get Category by user id
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token))
            {
                try
                {
                    IEnumerable<Category> cates = _categoryRepository.GetAllCategoriesById(model.Id);

                    var categories = _mapper.Map<IEnumerable<CategoryModel>>(cates);

                    return Ok(new { categories });
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
        [HttpPost("add")]
        public IActionResult Create([FromBody]CategoryModel model)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token))
            {
                var category = _mapper.Map<Category>(model);

                try
                {
                    _categoryRepository.AddCategory(category);
                    _categoryRepository.Save();
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
        [HttpPost("deleteById")]
        public IActionResult Delete([FromBody]CategoryModel model) // delete Category by category id
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token))
            {
                Category ret = _categoryRepository.GetCategory(model.Id);
                if (ret != null)
                {
                    try
                    {
                        _categoryRepository.DeleteWithTodos(ret);
                        _categoryRepository.Save();
                        return Ok();
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
        [HttpPost("editById")]
        public IActionResult Edit([FromBody]CategoryModel model) // delete Category by category id
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token))
            {
                try
                {
                    var category = _mapper.Map<Category>(model);
                    _categoryRepository.Edit(category);
                    _categoryRepository.Save();
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
    }
}