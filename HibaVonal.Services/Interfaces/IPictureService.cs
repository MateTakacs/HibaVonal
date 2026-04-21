using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HibaVonal.Services.Interfaces
{
    public interface IPictureService
    {
        Task<(bool succ, string message)> UploadPicturesAsync(IFormFile file, int issueId);    }
}
