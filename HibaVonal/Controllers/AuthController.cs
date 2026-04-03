using HibaVonal.DataContext.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HibaVonal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);

            if (!result.Success)
                return result.Message.Contains("nincs engedélyezve")
                    ? Unauthorized(new { message = result.Message })
                    : BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);

            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            return Ok(new { token = result.Token, user = result.User });
        }
    }
}