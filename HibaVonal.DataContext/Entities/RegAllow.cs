using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HibaVonal.DataContext.Entities
{
    public class RegAllow
    {
        public int Id { get; set; }
        public string NeptunCode { get; set; } = string.Empty;
        public bool Registered { get; set; }
    }
}
