using DeGroeneWeide.Objects;
using DeGroeneWeide;
using DeGroeneWeide.Settings;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DeGroeneWeide.ApiCalls
{
    internal class AuthLevelApi
    {

        public static HttpClient client = new();
        public static async Task<List<AuthLevel>> GetAllAuthLevels(string readerId)
        {
            string URL = $"{MainForm._settings.URL}/readers/getAllAuthLevels";
            Debug.WriteLine("GetAllAuthLevels URL: " + URL);
            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            var data = new
            {
                id = readerId
            };

            string json = JsonSerializer.Serialize(data);
            Debug.WriteLine(json);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(URL, content);
            string responseString = await response.Content.ReadAsStringAsync();
            Debug.WriteLine("Authlevels: " + responseString);

            if (response.IsSuccessStatusCode)
            {
                return JsonSerializer.Deserialize<List<AuthLevel>>(responseString) ?? new();
            }
            else
            {
                Console.WriteLine("Error: " + response.StatusCode);
                return new List<AuthLevel>();
            }
        }

        public static async Task LinkReaderAuth(string reader_Id, string authlevel_Id)
        {

            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            var data = new
            {
                readerId = reader_Id,
                authLevelId = authlevel_Id
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/auth/linkreaderauth", content);
            string responseString = await response.Content.ReadAsStringAsync();
        }

        public static async Task UnlinkReaderAuth(string reader_Id, string authlevel_Id)
        {

            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            var data = new
            {
                readerId = reader_Id,
                authLevelId = authlevel_Id
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/auth/unlinkreaderauth", content);
            string responseString = await response.Content.ReadAsStringAsync();
        }
    }
}
