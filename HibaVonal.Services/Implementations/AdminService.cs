using HibaVonal.DataContext.DB;
using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HibaVonal.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly HibaVonalDBContext _context;
        private readonly IConfiguration _configuration;

        public AdminService(HibaVonalDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<(bool added, string addMessage)> AddEquipment(EquipmentDTO equipment)
        {

           var newEquipment = new Equipment
            {
                EquipName = equipment.EquipName,
                EquipCost = equipment.EquipCost,
                CreateDate = DateTime.UtcNow
           };
            _context.Equipments.Add(newEquipment);
            await _context.SaveChangesAsync();
            return (true, $"Equipment added successfully, the id is {newEquipment.Id}");
        }

        public Task<(bool added, string addMessage)> AddRegAllow(string neptunCode)
        {
            throw new NotImplementedException();
        }

        public async Task<(bool deleted, string deleteMessage)> DeleteEquipment(int id)
        {
            var equipment = await _context.Equipments.FirstOrDefaultAsync(e => e.Id == id);
            if (equipment == null)
                return (false, "Equipment not found");
            _context.Equipments.Remove(equipment);
            await _context.SaveChangesAsync();
            return (true, "Equipment deleted successfully");

        }
    }
}
