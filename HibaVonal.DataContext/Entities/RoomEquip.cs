namespace HibaVonal.DataContext.Entities
{
    public class RoomEquip
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public Room Room { get; set; } = null!;
        public int EquipId { get; set; }
        public Equipment Equipment { get; set; } = null!;
    }
}
