using HibaVonal.DataContext.DB;
using HibaVonal.Services.DTOs;
using HibaVonal.DataContext.Entities;
using HibaVonal.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HibaVonal.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly HibaVonalDBContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(HibaVonalDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool Success, string Message)> RegisterAsync(RegisterRequest request)
        {
            // 1. Ellenőrzés: szerepel-e a whitelist táblában
            var regAllow = await _context.RegAllows
                .FirstOrDefaultAsync(r => r.NeptunCode == request.NeptunCode);

            if (regAllow == null)
                return (false, "Ez a Neptun-kód nincs engedélyezve a regisztrációhoz.");

            // 2. Ellenőrzés: már regisztrált-e
            if (regAllow.Registered)
                return (false, "Ez a Neptun-kód már regisztrálva van.");

            // 3. Ellenőrzés: létezik-e már ilyen Username
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.NeptunCode);

            if (existingUser != null)
                return (false, "Ez a felhasználónév már foglalt.");

            // 4. Jelszó hashelése BCrypt-tel
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // 5. Új felhasználó létrehozása
            var newUser = new User
            {
                Username = request.NeptunCode,
                Password = hashedPassword,
                Name = request.Name,
                Email = request.Email,
                Role = UserRole.User,
                RoomNum = request.RoomNum
            };

            _context.Users.Add(newUser);

            // 6. Registered flag beállítása true-ra
            regAllow.Registered = true;

            await _context.SaveChangesAsync();

            return (true, "Sikeres regisztráció!");
        }

        public async Task<(bool Success, string Message, string? Token, object? User)> LoginAsync(LoginRequest request)
        {
            // 1. Felhasználó keresése
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
                return (false, "Hibás felhasználónév vagy jelszó.", null, null);

            // 2. Jelszó ellenőrzése
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);

            if (!isPasswordValid)
                return (false, "Hibás felhasználónév vagy jelszó.", null, null);

            // 3. JWT token generálása
            var token = GenerateJwtToken(user);

            var userData = new
            {
                user.Id,
                user.Username,
                user.Name,
                user.Email,
                Role = user.Role.ToString(),
                user.RoomNum
            };

            return (true, "Sikeres bejelentkezés!", token, userData);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "60");

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}