using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HibaVonal.Controllers
{
    [ApiController]
    [Authorize]
    public abstract class AuthorizedControllerBase : ControllerBase
    {
        protected int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
            {
                throw new InvalidOperationException("A token nem tartalmaz érvényes felhasználó-azonosítót.");
            }

            return userId;
        }
    }
}
