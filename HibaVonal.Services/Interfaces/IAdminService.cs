using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HibaVonal.Services.Interfaces
{
    public  interface IAdminService
    {
        Task<(bool added, string addMessage)> AddEquipment(EquipmentDTO equipment);
        Task<List<Equipment>> GetEquipments();

        Task<(bool deleted, string deleteMessage)> DeleteEquipment(int id);
        Task<(bool added, string addMessage)> AddRegAllow(string neptunCode);
        Task<List<RegAllow>> GetFullWhitelist();

    }
}
