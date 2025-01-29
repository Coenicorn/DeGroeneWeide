using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DeGroeneWeide.ApiCalls
{
    internal class CustomerApi
    {
        public static List<Customer> Customers = new List<Customer>();
        public static HttpClient client = new();
        public static async Task GetCustomers()
        {
            await AddHeaders.AddHeadersToClient(client);

            try
            {
                HttpResponseMessage result = await client.GetAsync(MainForm._settings.URL + "/customers/getAllCustomers");
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();

                var c = JsonSerializer.Deserialize<List<Customer>>(json) ?? null;
                if (c != null) Customers = c;
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }

        }

        public static async Task<string?> UpdateCustomer(Customer c)
        {
            string URL = $"{MainForm._settings.URL}/customers/updateCustomer";
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                customerId = c.Id,
                firstName = c.FirstName,
                middleName = c.MiddleName,
                lastName =  c.LastName,
                maySave = 0,
                blacklisted = 0,
                phoneNumber = c.PhoneNumber,
                mailAddress = c.Email
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(URL, content);
            string responseString = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                return JsonSerializer.Serialize(responseString);
            }
            else
            {
                Console.WriteLine("Error: " + response.StatusCode);
                return null;
            }
        }

        public static async Task<string?> InsertCustomer(string firstname, string middlename, string lastname, string phonenumber, string mailaddress)
        {
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                firstName = firstname,
                middleName = middlename,
                lastName = lastname,
                maySave = "false",
                creationDate = DateTime.Now,
                blacklisted = "false",
                phoneNumber = phonenumber,
                mailAddress = mailaddress
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/customers/insertCustomer", content);
            string responseString = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var dictionary = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString);
                return dictionary?["customerId"];
            }
            else
            {
                Console.WriteLine("Error: " + response.StatusCode);
                return null;
            }
        }
    }
}
