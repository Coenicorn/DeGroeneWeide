using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DeGroeneWeide.ApiCalls
{
    internal class ReaderApi
    {
        public static List<Reader>? Readers;
        public static HttpClient client = new();

        public static async Task GetReaders()
        {
            string URL = $"{MainForm._settings.URL}/readers/getAllReaders";
            Debug.WriteLine("GetReaders URL: " + URL);
            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            try
            {
                HttpResponseMessage result = await client.GetAsync(URL);
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();
                Debug.WriteLine("Alle Readers: " + json);

                Readers = JsonSerializer.Deserialize<List<Reader>>(json);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        public static void EditReader(Reader reader)
        {
            string URL = $"{MainForm._settings.URL}/readers/updateReader";
            Debug.WriteLine("EditReader URL: " + URL);

            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            var data = new
            {
                name = reader.Name,
                reader.AmenityId
            };

            var json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = client.PostAsync(URL, content);


        }
    }
}
