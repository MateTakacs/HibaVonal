namespace HibaVonal.DataContext.Entities
{
    public enum TypeEnum
    {
        Common,
        Single,
        Double
    }
    public class Room
    {
        public int Id { get; set; }
        public int RoomNum { get; set; }
        public TypeEnum Type { get; set; }
        public List<User> Tenants { get; set; } = [];
        public List<Issue> Issues { get; set; } = [];
        public List<RoomEquip> RoomEquips { get; set; } = [];
    }
}
