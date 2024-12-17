using System;
using System.Diagnostics;
using System.Windows.Forms;

namespace DeGroeneWeide
{
    public partial class Form1 : Form
    {
        public UC_PasjesPagina pasjesPagina = new UC_PasjesPagina();
        //public UC_Scanners scannerPagina = new UC_Scanners();

        public Form1()
        {
            InitializeComponent();
            ApiCalls.GetReaders();
            ApiCalls.GetLastCard();
            //ApiCalls.EditReader(ApiCalls.Readers[0]);
            LoadPage(0);
        }

        // een functie die verschillende pagina's kan laden.
        // 0 = Pasjes Pagina, 1 = Scanner Pagina
        public void LoadPage(int navIndex)
        {
            pagina_container.Controls.Clear();
            if (navIndex == 0)
            {
                pagina_container.Controls.Add(pasjesPagina);
            }
            else if (navIndex == 1)
            {
               // pagina_container.Controls.Add(scannerPagina);
            }
            else
            {
                return;
            }
        }

        private void btn_PasjesPagina_Click(object sender, EventArgs e)
        {
            LoadPage(0);
        }

        private void btn_ScannersPagina_Click(object sender, EventArgs e)
        {
            LoadPage(1);
        }

        private void pagina_container_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
