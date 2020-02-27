using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoListWeb.Data.Repositories;
using TodoListWeb.Models;
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
        public CategoryController(ICategoryRepository categoryRepository,
                                    IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        [HttpPost("create")]
        public IActionResult Create([FromBody]CategoryModel model)
        {
            var category = _mapper.Map<Category>(model);

            try
            {
                // create user
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
    }
}