﻿using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DeGroeneWeide.ApiCalls
{
    internal class BookingApi
    {
        public static List<Booking> Bookings = new();
        public static HttpClient client = new();
        public static async Task GetBooking()
        {
            string URL = $"{MainForm._settings.URL}/booking/getAllBookings";
            Debug.WriteLine("GetBooking URL: " + URL);
            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            try
            {
                HttpResponseMessage result = await client.GetAsync(URL);
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();
                json = Regex.Replace(json, @"\b(\d{2})-(\d{2})-(\d{4})\b", "$3-$2-$1");
                Debug.WriteLine("Booking Json" + json);

                Bookings = JsonSerializer.Deserialize<List<Booking>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true}) ?? new List<Booking>();

                foreach (Booking booking in Bookings)
                {
                    booking.DumpInfo();
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }

        }
    }
}
