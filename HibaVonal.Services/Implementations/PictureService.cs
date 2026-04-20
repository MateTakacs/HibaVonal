using HibaVonal.DataContext.DB;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HibaVonal.Services.Implementations
{
    
    public class PictureUpload : IPictureUpload
    {
        private readonly string _dirpath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedPictures");
        private readonly HibaVonalDBContext _context;
        private readonly IConfiguration _configuration;
        public PictureUpload(HibaVonalDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            if (!Directory.Exists(_dirpath))
            {
                Directory.CreateDirectory(_dirpath);
            }
        }

        //public Task<string> ShowPicture(int issueId)
        //{
        //    var issue = _context.Issues.Find(issueId);
        //}

        public async Task<(bool succ, string message)> UploadPicturesAsync(IFormFile file, int issueId)
        {
            if (file == null || file.Length == 0)
            {
                return (false, "Nincs kiválasztott fájl");
            }
            else
            {
                var filename = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filepath = Path.Combine(_dirpath, filename);

                using (var stream = new FileStream(filepath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                    var issue = await _context.Issues.FindAsync(issueId);
                    if (issue != null)
                    {
                        issue.issuePicPath = $"/uploaded-pictures/{filename}";
                        await _context.SaveChangesAsync();
                    }
                }

                return (true, "Fájl sikeresen feltöltve");
            }
        }
    }
}
