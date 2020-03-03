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
        private readonly INewCategoryRepository _newCategoryRepository;
        private IMapper _mapper;
        private IUserService _userService;
        public CategoryController(INewCategoryRepository newCategoryRepository,
                                    IMapper mapper,
                                    IUserService userService)
        {
            _newCategoryRepository = newCategoryRepository;
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
                    IEnumerable<NewCategory> cates = _newCategoryRepository.GetAllCategoriesById(model.Id);

                    var categories = _mapper.Map<IEnumerable<NewCategoryModel>>(cates);

                    //return new JsonResult(categories);
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
        public IActionResult Create([FromBody]NewCategoryModel model)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token))
            {
                var category = _mapper.Map<NewCategory>(model);

                try
                {
                    _newCategoryRepository.AddCategory(category);
                    _newCategoryRepository.Save();

                    IEnumerable<NewCategory> cates = _newCategoryRepository.GetAllCategoriesById(model.Owner);

                    var categories = _mapper.Map<IEnumerable<NewCategoryModel>>(cates);

                    //return new JsonResult(categories);
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
        [HttpPost("deleteById")]
        public IActionResult Delete([FromBody]NewCategoryModel model) // delete Category by category id
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token))
            {
                NewCategory ret = _newCategoryRepository.GetCategory(model.Id);
                if (ret != null)
                {
                    try
                    {
                        _newCategoryRepository.DeleteWithTodos(ret);
                        _newCategoryRepository.Save();

                        IEnumerable<NewCategory> cates = _newCategoryRepository.GetAllCategoriesById(model.Owner);

                        var categories = _mapper.Map<IEnumerable<NewCategoryModel>>(cates);

                        //return new JsonResult(categories);
                        return Ok(new { categories });
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
        public IActionResult Edit([FromBody]NewCategoryModel model) // delete Category by category id
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token))
            {
                try
                {
                    var category = _mapper.Map<NewCategory>(model);
                    _newCategoryRepository.Edit(category);
                    _newCategoryRepository.Save();

                    IEnumerable<NewCategory> cates = _newCategoryRepository.GetAllCategoriesById(model.Owner);

                    var categories = _mapper.Map<IEnumerable<NewCategoryModel>>(cates);

                    //return new JsonResult(categories);
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
    }
}