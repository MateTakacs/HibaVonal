namespace HibaVonal.DataContext.DTOs
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