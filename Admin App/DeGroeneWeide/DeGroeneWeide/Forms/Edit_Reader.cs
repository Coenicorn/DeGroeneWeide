using DeGroeneWeide.ApiCalls;
using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DeGroeneWeide.Forms
{
    public partial class Edit_Reader : Form
    {
        List<AuthLevel>? authLevels;
        List<AuthLevel> allAuthLevels = new List<AuthLevel>{
            new AuthLevel(id: "301e7bb66c9", name: "Gast"),
            new AuthLevel(id: "01e7bb66c91", name: "Bezoeker"),
            new AuthLevel(id: "1e7bb66c91e", name: "Medewerker"),
            new AuthLevel(id: "e7bb66c91e7", name: "Administrator")
            };
        bool nameChanged = false;
        string readerId = "";
        public Edit_Reader()
        {
            InitializeComponent();
        }

        public void FillInfo(Reader reader, List<AuthLevel> levels)
        {
            foreach (AuthLevel authLevel in levels)
            {
                switch (authLevel.Name)
                {
                    case "Gast":
                        gast.Checked = true;
                        break;

                    case "Bezoeker":
                        bezoeker.Checked = true;
                        break;

                    case "Medewerker":
                        medewerker.Checked = true;
                        break;

                    case "Administrator":
                        administrator.Checked = true;
                        break;

                    default:
                        continue;

                }
            }
            authLevels = levels;
            name.Text = reader.Name;
            if (reader.Id == null) { return;  }
            readerId = reader.Id;
        }

        private void name_TextChanged(object sender, EventArgs e)
        {
            nameChanged = true;
        }

        private async void btn_save_Click(object sender, EventArgs e)
        {
            Debug.WriteLine(name.Text);
            await ReaderApi.UpdateReader(readerId, name.Text);
            if (gast.Checked) { await AuthLevelApi.LinkReaderAuth(readerId, "301e7bb66c9"); } else { await AuthLevelApi.UnlinkReaderAuth(readerId, "301e7bb66c9"); }
            if (bezoeker.Checked) { await AuthLevelApi.LinkReaderAuth(readerId, "01e7bb66c91"); } else { await AuthLevelApi.UnlinkReaderAuth(readerId, "01e7bb66c91"); }
            if (medewerker.Checked) { await AuthLevelApi.LinkReaderAuth(readerId, "1e7bb66c91e"); } else { await AuthLevelApi.UnlinkReaderAuth(readerId, "1e7bb66c91e"); }
            if (administrator.Checked) { await AuthLevelApi.LinkReaderAuth(readerId, "e7bb66c91e7"); } else { await AuthLevelApi.UnlinkReaderAuth(readerId, "e7bb66c91e7"); }

            this.Close();
        }
    }
}
