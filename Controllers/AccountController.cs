using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TodoListWeb.Helpers;
using TodoListWeb.Models;
using TodoListWeb.Services;
using TodoListWeb.ViewModels;

namespace TodoListWeb.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private IUserService _userService;
        private IEmailSender _emailSender;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public AccountController(IUserService userService,
                                 IMapper mapper,
                                 IOptions<AppSettings> appSettings,
                                 IEmailSender emailSender)
        {
            _userService = userService;
            _appSettings = appSettings.Value;
            _mapper = mapper;
            _emailSender = emailSender;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]AuthenticateModel model)
        {
            var user = _userService.Authenticate(model.Email, model.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            // check if user confirmed email
            if(!_userService.CheckConfirmed(user.Email))
                return Unauthorized(new { message = "User need to confirm email address" });

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("validate")]
        public IActionResult Validate()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

            if (_userService.Validate(token)!= null)
                return Ok();
            else
                return Unauthorized(new { message = "Invalid Token" });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]RegisterModel model)
        {
            // map model to entity
            var user = _mapper.Map<User>(model);

            try
            {
                // create user
                _userService.Create(user, model.Password);
                var userId = _userService.getUserId(model.Email);

                // create token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                    new Claim(ClaimTypes.Name, userId.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddDays(10),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                var code = tokenString;
                var callbackUrl = Url.Action("verifyUser", "account", new { userId = userId, code = code }, protocol: HttpContext.Request.Scheme);
                var html = "Confirm your account Please confirm your account by clicking this link: <a href='"+callbackUrl+"'>link</a>";
                _emailSender.SendEmailAsync(user.Email, "Welcome to Doobi-Do! Confirm Your Email", "Welcome", html);
                
                return Ok();
            }
            catch (Exception ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("confirmEmail")]
        public IActionResult ConfirmEmail([FromBody] ConfirmEmailModel model)
        {
            try
            {
                var tokenClaims = _userService.Validate(model.token);
                if (tokenClaims == null)
                    return Unauthorized();

                var userId = tokenClaims.Identity.Name;
                if (model.id.Contains(userId))
                {
                    _userService.ConfirmEmail(model.id);
                    return Ok();
                }
                else
                    return Unauthorized(new { message = "Invalid access" });
            }
            catch(Exception e)
            {
                return BadRequest( new { e });
            }
        }
        /*
        [AllowAnonymous]
        [HttpGet("ConfirmEmail")]
        public IActionResult ConfirmEmail([FromQuery(Name = "userId")] string id, [FromQuery(Name = "code")] string token)
        {
            try
            {
                var tokenClaims = _userService.Validate(token);
                if (tokenClaims == null)
                    return Unauthorized();

                var userId = tokenClaims.Identity.Name;
                if (id.Contains(userId))
                {
                    _userService.ConfirmEmail(id);
                    return Ok();
                }
                else
                    return Unauthorized(new { message = "Invalid access" });
            }
            catch(Exception e)
            {
                return BadRequest( new { e });
            }
        }
         */


        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            return Ok(users);
        }
    }
}