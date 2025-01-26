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
        List<AuthLevel>? allAuthLevels;
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
                    case "gast":
                        gast.Checked = true;
                        break;

                    case "bezoeker":
                        bezoeker.Checked = true;
                        break;

                    case "medewerker":
                        medewerker.Checked = true;
                        break;

                    case "administrator":
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

        private async void btn_save_Click(object sender, EventArgs e)
        {
            allAuthLevels = await AuthLevelApi.GetAllAuthLevels();
            if(allAuthLevels != null)
            {
                string? gast_id = allAuthLevels.FirstOrDefault(a => a.Name == "gast")?.Id;
                string? bezoeker_id = allAuthLevels.FirstOrDefault(a => a.Name == "bezoeker")?.Id;
                string? medewerker_id = allAuthLevels.FirstOrDefault(a => a.Name == "medewerker")?.Id;
                string? admin_id = allAuthLevels.FirstOrDefault(a => a.Name == "admin")?.Id;

                if (gast_id != null)
                { if (gast.Checked) { await AuthLevelApi.LinkReaderAuth(readerId, gast_id); } else { await AuthLevelApi.UnlinkReaderAuth(readerId, gast_id); } }
                if (bezoeker_id != null)
                { if (bezoeker.Checked) { await AuthLevelApi.LinkReaderAuth(readerId, bezoeker_id); } else { await AuthLevelApi.UnlinkReaderAuth(readerId, bezoeker_id); } }
                if(medewerker_id != null)
                { if (medewerker.Checked) { await AuthLevelApi.LinkReaderAuth(readerId, medewerker_id); } else { await AuthLevelApi.UnlinkReaderAuth(readerId, medewerker_id); } }
                if(admin_id != null)
                { if (administrator.Checked) { await AuthLevelApi.LinkReaderAuth(readerId, admin_id); } else { await AuthLevelApi.UnlinkReaderAuth(readerId, admin_id); } }
            }
            Debug.WriteLine(name.Text);
            await ReaderApi.UpdateReader(readerId, name.Text);

            this.Close();
        }
    }
}
