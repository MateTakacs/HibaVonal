namespace HibaVonal.DataContext.Entities
{
    public class ToolUser
    {
        public int Id { get; set; }
        public int ToolId { get; set; }
        public Tool Tool { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
