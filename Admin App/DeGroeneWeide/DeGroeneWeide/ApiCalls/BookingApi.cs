using DeGroeneWeide.Objects;
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
                json = Regex.Replace(json, @"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})", "$1T$2");
                json = json.Replace("\"confirmed\":0", "\"confirmed\":false")
                           .Replace("\"confirmed\":1", "\"confirmed\":true");
                json = json.Replace("\"maySave\":\"false\"", "\"maySave\":false")
                           .Replace("\"maySave\":\"true\"", "\"maySave\":true")
                           .Replace("\"blacklisted\":\"false\"", "\"blacklisted\":false")
                           .Replace("\"blacklisted\":\"true\"", "\"blacklisted\":true");
                Debug.WriteLine("Booking Json: " + json);

                Bookings = JsonSerializer.Deserialize<List<Booking>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<Booking>();

                foreach (Booking booking in Bookings)
                {
                    booking.DumpInfo();
                }
            }
            catch (HttpRequestException httpEx)
            {
                Debug.WriteLine($"HTTP request error: {httpEx.Message}");
            }
            catch (JsonException jsonEx)
            {
                Debug.WriteLine($"JSON parsing error: {jsonEx.Message}");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"An error occurred: {ex.Message}");
            }
        }

        public static async Task UpdateBooking(Booking b)
        {
            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            var data = new
            {
                id = b.Id,
                customerId = b.CustomerId,
                startDate = b.StartDate,
                endDate = b.EndDate,
                amountPeople = b.AmountPeople,
                notes = ""
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/booking/updateBooking", content);
            string responseString = await response.Content.ReadAsStringAsync();
        }

        public static async Task DeleteBooking(string Id)
        {
            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            var data = new
            {
                id = Id,
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/booking/deleteBooking", content);
            string responseString = await response.Content.ReadAsStringAsync();
            Debug.WriteLine(responseString);
        }

        public static async Task InsertBooking(string CustomerId, string StartDate, string EndDate, int AmountPeople)
        {
            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            var data = new
            {
                customerId = CustomerId,
                startDate = StartDate,
                endDate = EndDate,
                amountPeople = AmountPeople,
                notes = ""
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/booking/insertBooking", content);
            string responseString = await response.Content.ReadAsStringAsync();
            Debug.WriteLine(responseString);
        }
    }
}
