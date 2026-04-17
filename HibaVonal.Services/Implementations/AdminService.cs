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
            var existing = await _context.Equipments
                .AnyAsync(e => e.EquipName.ToLower() == equipment.EquipName.ToLower());

            if (existing)
                return (false, $"Hiba: '{equipment.EquipName}' nevű eszköz már létezik.");

            try
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
            catch (Exception)
            {
                return (false, "Hiba történt az eszköz mentése közben.");
            }
        }

        public async Task<List<Equipment>> GetEquipments()
        {
            return await _context.Equipments
                .AsNoTracking()
                .OrderBy(e => e.EquipName)
                .ToListAsync();
        }

        public async Task<(bool deleted, string deleteMessage)> DeleteEquipment(int id)
        {
            var equipment = await _context.Equipments.FirstOrDefaultAsync(e => e.Id == id);

            if (equipment == null)
                return (false, "Hiba: Az eszköz nem található.");

            var isUsedInRoom = await _context.RoomEquips.AnyAsync(re => re.EquipId == id);
            var isUsedInIssue = await _context.Issues.AnyAsync(i => i.EquipmentId == id);

            if (isUsedInRoom || isUsedInIssue)
                return (false, "Hiba: Az eszköz nem törölhető, mert már használatban van.");

            try
            {
                _context.Equipments.Remove(equipment);
                await _context.SaveChangesAsync();
                return (true, "Az eszköz sikeresen törölve lett.");
            }
            catch (Exception)
            {
                return (false, "Hiba történt a törlés végrehajtása közben.");
            }
        }

        public async Task<(bool added, string addMessage)> AddRegAllow(string neptunCode)
        {
            if (string.IsNullOrWhiteSpace(neptunCode))
                return (false, "Hiba: A Neptun-kód nem lehet üres.");

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