using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using DeGroeneWeide.Objects;
using DeGroeneWeide.ApiCalls;
using System.Diagnostics;
using DeGroeneWeide.Forms;

namespace DeGroeneWeide
{
    public partial class UC_Scanner : UserControl
    {
        private Reader? reader;
        private List<AuthLevel>? authLevels;
        private UC_ScannerPagina? Pagina;
        private Point[] locationsView = new Point[]
        {
            new Point(22, 50),
            new Point(22, 69),
            new Point(22, 88),
            new Point(22, 107)
        };
        private Point[] locationsText = new Point[]
        {
            new Point(42, 50),
            new Point(42, 69),
            new Point(42, 88),
            new Point(42, 107)
        };
        public UC_Scanner()
        {
            InitializeComponent();
        }

        public async void Fill(Reader reader, UC_ScannerPagina pagina)
        {
            Pagina = pagina;
            this.reader = reader;
            Gast_Active_View.Visible = false; lbl_Gast.Visible = false;
            Bezoeker_Active_View.Visible = false; lbl_Bezoeker.Visible = false;
            Medewerker_Active_View.Visible = false; lbl_Medewerker.Visible = false;
            Administrator_Active_View.Visible = false; lbl_Admin.Visible = false;

            if (reader == null || reader.Id == null)
            {
                return;
            }

            lbl_name.Text = reader.Name;

            // Als de reader niet active is een warning laten zien
            if (reader.Active == 0)
            {
                picture_warning.Visible = true;
            }
            else
            {
                picture_warning.Visible = false;
            }

            // Zorgt dat de juiste levels van toegang op actief staan
            authLevels = await AuthLevelApi.GetAllAuthLevelsReaders(reader.Id);
            int i = 0;
            foreach (AuthLevel authLevel in authLevels)
            {
                Debug.WriteLine(authLevel.Name + " - " + authLevel.Id);
                switch (authLevel.Name)
                {
                    case "gast":
                        Gast_Active_View.Location = locationsView[i];
                        lbl_Gast.Location = locationsText[i];
                        Gast_Active_View.Visible = true;
                        lbl_Gast.Visible = true;
                        i++;
                        break;

                    case "bezoeker":
                        Bezoeker_Active_View.Location = locationsView[i];
                        lbl_Bezoeker.Location = locationsText[i];
                        Bezoeker_Active_View.Visible = true;
                        lbl_Bezoeker.Visible = true;
                        i++;
                        break;

                    case "medewerker":
                        Medewerker_Active_View.Location = locationsView[i];
                        lbl_Medewerker.Location = locationsText[i];
                        Medewerker_Active_View.Visible = true;
                        lbl_Medewerker.Visible = true;
                        i++;
                        break;

                    case "admin":
                        Administrator_Active_View.Location = locationsView[i];
                        lbl_Admin.Location = locationsText[i];
                        Administrator_Active_View.Visible = true;
                        lbl_Admin.Visible = true;
                        i++;
                        break;

                    default:
                        continue;

                }
            }
        }

        private async void btn_edit_Click(object sender, EventArgs e)
        {
            Edit_Reader edit = new();
            if (reader != null && authLevels != null)
            {
                edit.FillInfo(reader, authLevels);
            }
            edit.ShowDialog();
            await ReaderApi.GetReaders();
            if (Pagina != null) { Pagina.Fill(); }
        }
    }
}
