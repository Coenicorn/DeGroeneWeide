using DeGroeneWeide.ApiCalls;
using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DeGroeneWeide
{
    public partial class UC_ScannerPagina : UserControl
    {
        DateTime lastRefresh;
        public UC_ScannerPagina()
        {
            InitializeComponent();
            Fill();
        }

        // Vult de scanner pagina met de hoeveelheid scanners die er in readers list staan
        public async void Fill()
        {
            if (ReaderApi.Readers != null)
            {
                scanner_container.Controls.Clear();
                foreach (Reader reader in ReaderApi.Readers)
                {
                    UC_Scanner scanner = new();
                    scanner_container.Controls.Add(scanner);
                    scanner.Fill(reader);
                }
            }
            lastRefresh = DateTime.Now;
        }

        // Button die refreshed, moet nog in een await anders gaat dit niet goed!
        private async void btn_refresh_Click(object sender, EventArgs e)
        {
            await ReaderApi.GetReaders();
            Fill();
        }

        //Task die om de dag refreshed
        public void checkLastRefresh() 
        {
            if(lastRefresh < DateTime.Now.AddDays(-1))
            {
                ReaderApi.GetReaders();
                Fill();
            }
        }

    }
}
