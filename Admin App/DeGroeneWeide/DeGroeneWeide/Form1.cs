namespace DeGroeneWeide
{
    public partial class Form1 : Form
    {
        public UC_PasjesPagina pasjesPagina = new UC_PasjesPagina();
        public UC_ScannersPagina scannerPagina = new UC_ScannersPagina();
        public Form1()
        {
            InitializeComponent();
            LoadPage(0);
        }

        public void LoadPage(int navIndex)
        {
            pagina_container.Controls.Clear();
            if (navIndex == 0)
            { pagina_container.Controls.Add(pasjesPagina); }
            else if (navIndex == 1)
            { pagina_container.Controls.Add(scannerPagina); }
            else
            { return; }
        }

        private void btn_PasjesPagina_Click(object sender, EventArgs e)
        {
            LoadPage(0);
        }

        private void btn_ScannersPagina_Click(object sender, EventArgs e)
        {
            LoadPage(1);
        }
    }
}
