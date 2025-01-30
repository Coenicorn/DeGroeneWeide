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
            string URL = $"{Properties.Settings.Default.URL}/booking/getAllBookings";
            await AddHeaders.AddHeadersToClient(client);

            try
            {
                HttpResponseMessage result = await client.GetAsync(URL);
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();
                json = Regex.Replace(json, @"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})", "$1T$2");
                json = json.Replace("\"confirmed\":false", "\"confirmed\":\"false\"")
                           .Replace("\"confirmed\":true", "\"confirmed\":\"true\"")
                           .Replace("\"maySave\":false", "\"maySave\":\"false\"")
                           .Replace("\"maySave\":true", "\"maySave\":\"true\"")
                           .Replace("\"blacklisted\":false", "\"blacklisted\":\"false\"")
                           .Replace("\"blacklisted\":true", "\"blacklisted\":\"true\"");
                json = json.Replace("\"confirmed\":0", "\"confirmed\":\"false\"")
                           .Replace("\"confirmed\":1", "\"confirmed\":\"true\"")
                           .Replace("\"maySave\":0", "\"maySave\":\"false\"")
                           .Replace("\"maySave\":1", "\"maySave\":\"true\"")
                           .Replace("\"blacklisted\":0", "\"blacklisted\":\"false\"")
                           .Replace("\"blacklisted\":1", "\"blacklisted\":\"true\"");
                Debug.WriteLine("Booking Json: " + json);

                Bookings = JsonSerializer.Deserialize<List<Booking>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<Booking>();
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
            await AddHeaders.AddHeadersToClient(client);

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

            HttpResponseMessage response = await client.PostAsync(Properties.Settings.Default.URL + "/booking/updateBooking", content);
            string responseString = await response.Content.ReadAsStringAsync();
        }

        public static async Task DeleteBooking(string Id)
        {
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                id = Id,
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(Properties.Settings.Default.URL + "/booking/deleteBooking", content);
            string responseString = await response.Content.ReadAsStringAsync();
            Debug.WriteLine(responseString);
        }

        public static async Task InsertBooking(string CustomerId, DateTime StartDate, DateTime EndDate, int AmountPeople)
        {
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                customerId = CustomerId,
                startDate = StartDate,
                endDate = EndDate,
                amountPeople = AmountPeople,
                notes = "",
                confirmed = true
            };

            string json = JsonSerializer.Serialize(data);
            Debug.WriteLine($"Booking JSON: {json}");
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(Properties.Settings.Default.URL + "/booking/insertBooking", content);
            string responseString = await response.Content.ReadAsStringAsync();
            Debug.WriteLine(responseString);
        }
    }
}
