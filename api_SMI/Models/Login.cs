using System;
using System.DirectoryServices;
using System.ComponentModel.DataAnnotations;

namespace api_SMI.Models
{
    public class Login
    {
        public string? matricule { get; set; }
        public string? password { get; set; }
        public string? mail { get; set; }
    }
}
