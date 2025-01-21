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
    public struct UpdateReaderRequestJSON
    {
        public string id;
        public string amenityId;
        public string name;
    }
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
                foreach(Reader r in Readers)
                {
                    r.DumpInfo();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        public static async Task UpdateReader(string reader_Id, string reader_name)
        {

            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            var data = new
            {
                id = reader_Id,
                name = reader_name,
                amenityId = (string?)null
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/readers/updateReader", content);
            string responseString = await response.Content.ReadAsStringAsync();
            Debug.WriteLine(responseString);
        }
    }
}
