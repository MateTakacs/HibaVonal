using HibaVonal.DataContext.DTOs;

namespace HibaVonal.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterAsync(RegisterRequest request);
        Task<(bool Success, string Message, string? Token, object? User)> LoginAsync(LoginRequest request);
    }
}