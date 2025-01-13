using DeGroeneWeide.ApiCalls;
using DeGroeneWeide.Settings;
using DeGroeneWeide.User_Controls;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Windows.Forms;

namespace DeGroeneWeide
{
    public partial class MainForm : Form
    {
        public static AppSettings _settings = new();

        public UC_PasjesPagina pasjesPagina = new();
        public UC_ScannerPagina scannerPagina = new();
        public UC_BoekingsPagina boekingsPagina = new();

        public MainForm(IOptions<AppSettings> settings)
        {
            InitializeComponent();
            _settings = settings.Value;
            FirstLoad();
        }

        public async void FirstLoad()
        {
            await ReaderApi.GetReaders();
            //ApiCalls.GetLastCard();

            pasjesPagina = new();
            scannerPagina = new();

            LoadPage("Pasjes");
        }

        // een functie die verschillende pagina's kan laden.
        public void LoadPage(string pagina)
        {
            pagina_container.Controls.Clear();
            switch (pagina)
            {
                case "Pasjes": pagina_container.Controls.Add(pasjesPagina); break;
                case "Scanner": pagina_container.Controls.Add(scannerPagina); break;
                case "Boeking": pagina_container.Controls.Add(boekingsPagina); Debug.WriteLine("BoekingsPagina Geladen"); break;
                default: pagina_container.Controls.Add(pasjesPagina); break;
            }
        }

        private void btn_PasjesPagina_Click(object sender, EventArgs e)
        {
            LoadPage("Pasjes");
        }

        private void btn_ScannersPagina_Click(object sender, EventArgs e)
        {
            LoadPage("Scanner");
        }

        private void btn_BoekingsPagina_Click(object sender, EventArgs e)
        {
            LoadPage("Boeking");
        }
    }
}
