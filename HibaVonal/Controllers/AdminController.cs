using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HibaVonal.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] 
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("equipment")]
        public async Task<IActionResult> AddEquipment([FromBody] EquipmentDTO equipmentDto)
        {
            var result = await _adminService.AddEquipment(equipmentDto);
            if (!result.added)
                return BadRequest(new { message = result.addMessage });

            return Ok(new { message = result.addMessage });
        }

        [HttpDelete("equipment/{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            var result = await _adminService.DeleteEquipment(id);
            if (!result.deleted)
                return NotFound(new { message = result.deleteMessage });

            return Ok(new { message = result.deleteMessage });
        }


        [HttpPost("whitelist")]
        public async Task<IActionResult> AddRegAllow([FromBody] string neptunCode)
        {
            if (string.IsNullOrWhiteSpace(neptunCode))
                return BadRequest(new { message = "A Neptun-kód nem lehet üres." });

            var result = await _adminService.AddRegAllow(neptunCode);
            if (!result.added)
                return BadRequest(new { message = result.addMessage });

            return Ok(new { message = result.addMessage });
        }

        [HttpGet("whitelist")]
        public async Task<IActionResult> GetWhitelist()
        {
            var list = await _adminService.GetFullWhitelist();
            return Ok(list);
        }
    }
}