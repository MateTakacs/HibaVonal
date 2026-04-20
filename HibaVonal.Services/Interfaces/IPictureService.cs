using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HibaVonal.Services.Interfaces
{
    public interface IPictureUpload
    {
        Task<(bool succ, string message)> UploadPicturesAsync(IFormFile file, int issueId);
        //Task<(bool succ, string message)> ShowPicture(int issueId);
    }
}
