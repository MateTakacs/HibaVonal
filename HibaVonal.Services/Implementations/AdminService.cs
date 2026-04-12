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
            return (true, $"Az eszköz sikeresen hozzáadva, az azonosítója: {newEquipment.Id}");
        }

       

        public async Task<(bool deleted, string deleteMessage)> DeleteEquipment(int id)
        {
            var equipment = await _context.Equipments.FirstOrDefaultAsync(e => e.Id == id);
            if (equipment == null)
                return (false, "Az eszköz nem található.");
            _context.Equipments.Remove(equipment);
            await _context.SaveChangesAsync();
            return (true, "Az eszköz sikeresen törölve lett.");

        }

        public async Task<(bool added, string addMessage)> AddRegAllow(string neptunCode)
        {
            var existing = await _context.RegAllows
                .FirstOrDefaultAsync(r => r.NeptunCode == neptunCode);

            if (existing != null)
                return (false, "Ez a Neptun-kód már szerepel az engedélyezett listán.");

        
            var newAllow = new RegAllow
            {
                NeptunCode = neptunCode,
                Registered = false 
            };

            _context.RegAllows.Add(newAllow);
            await _context.SaveChangesAsync();

            return (true, $"A(z) {neptunCode} Neptun-kód sikeresen hozzáadva a whitelist-hez.");
        }

        public async Task<List<RegAllow>> GetFullWhitelist()
        {
            return await _context.RegAllows
                .AsNoTracking() 
                .OrderBy(r => r.NeptunCode)
                .ToListAsync();
        }
    }
}
