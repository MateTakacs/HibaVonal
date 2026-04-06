using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HibaVonal.Services.DTOs
{
    public record RegisterRequest(
        string NeptunCode,
        string Password,
        string Name,
        string Email,
        int? RoomNum
    );

    public record LoginRequest(
        string Username,
        string Password
    );
}
