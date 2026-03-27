namespace HibaVonal.DataContext.Entities
{
    public class Equipment
    {
        public int Id { get; set; }
        public string EquipName { get; set; } = string.Empty;
        public int EquipCost { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
