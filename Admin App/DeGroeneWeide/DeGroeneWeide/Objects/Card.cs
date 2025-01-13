using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DeGroeneWeide.Objects
{
    public class Card
    {
        public string? Id { get; set; }
        public string? Card_uuid { get; set; }
        public string? Booking_id { get; set; }
        public string? Token { get; set; }
        public int? Level { get; set; }
        public int? Blocked { get; set; }

        public Card(string? id, string? card_uuid, string? booking_Id, string? token, int? level, int? blocked) 
        {
            Id = id;
            Card_uuid = card_uuid;
            Booking_id = booking_Id;
            Token = token;
            Level = level;
            Blocked = blocked;
        }
        public void DumpInfo()
        {
            Debug.WriteLine($"Id: {Id}, card uuid: {Card_uuid}, booking id: {Booking_id}, token: {Token}, level: {Level}, blocked: {Blocked}");
        }
    }
}
