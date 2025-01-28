using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;

namespace DeGroeneWeide.ApiCalls
{
    public static class AddHeaders
    {
        public static async Task<HttpClient> AddHeadersToClient(HttpClient client)
        {
            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            if (!client.DefaultRequestHeaders.Contains("x-api-key"))
            {
                client.DefaultRequestHeaders.Add("x-api-key", Properties.Settings.Default.KEY);
            }

            await Task.CompletedTask;
            return client;
        }
    }
}
