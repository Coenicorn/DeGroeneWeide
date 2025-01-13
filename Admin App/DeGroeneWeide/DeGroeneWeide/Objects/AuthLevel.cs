using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DeGroeneWeide.Objects
{
    public class AuthLevel
    {
        public string? Id { get; set; }
        public string? Name { get; set; }

        AuthLevel(string? id, string? name) 
        {
            Id = id;
            Name = name;
        }

        public void DumpInfo()
        {
            Debug.WriteLine($"id: {Id}, name: {Name}");
        }
    }
}
