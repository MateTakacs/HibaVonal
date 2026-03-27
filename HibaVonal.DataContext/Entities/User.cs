namespace HibaVonal.DataContext.Entities
{
    public enum UserRole
    {
        User,
        Maintainer,
        Lead_Maintainer,
        Admin
    }
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public int? RoomNum { get; set; }
        public Room? Room { get; set; } = null!;
        public List<Issue> AssignedIssues { get; set; } = [];
        public List<ToolUser> ToolUsers { get; set; } = [];
    }
}
