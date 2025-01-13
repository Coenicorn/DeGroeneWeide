using DeGroeneWeide.Settings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DeGroeneWeide
{
    public static class Program
    {
        public static IServiceProvider? ServiceProvider { get; private set; }
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();

            var serviceCollection = new ServiceCollection();

            ConfigureServices(serviceCollection);

            ServiceProvider = serviceCollection.BuildServiceProvider();

            Application.Run(ServiceProvider.GetRequiredService<MainForm>());
        }

        private static void ConfigureServices(ServiceCollection serviceCollection)
        {
            var config = new ConfigurationBuilder().SetBasePath(AppContext.BaseDirectory + "\\Settings")
                .AddJsonFile("appsettings.json", false, true)
                .Build();

            serviceCollection.Configure<AppSettings>(config.GetSection("AppSettings"));

            serviceCollection.AddTransient<MainForm>();
        }
    }
}