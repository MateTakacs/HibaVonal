using HibaVonal.DataContext.Entities;

namespace HibaVonal.DTOs
{
    public class GetUserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public int? RoomNum { get; set; }

        public static GetUserDto FromEntity(User user) => new GetUserDto
        {
            Id = user.Id,
            Username = user.Username,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            RoomNum = user.RoomNum
        };
    }
}
