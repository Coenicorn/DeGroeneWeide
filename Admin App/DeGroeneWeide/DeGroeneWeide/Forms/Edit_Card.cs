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

namespace DeGroeneWeide.Forms
{
    public partial class Edit_Card : Form
    {
        private Card Card;
        public Edit_Card()
        {
            InitializeComponent();
        }

        public async void FillComboBox()
        {
            await BookingApi.GetBooking();
            foreach (Booking b in BookingApi.Bookings)
            {
                combox_boekingen.Items.Add($"{b.Id} - {b.FirstName} {b.MiddleName} {b.LastName}".Replace("  ", " "));
            }
        }

        public void Fill(Card c)
        {
            Card = c;
            if (!string.IsNullOrEmpty(c.BookingId)) {
                combox_boekingen.Text = $"{c.BookingId} - {c.FirstName} {c.MiddleName} {c.LastName}".Replace("  ", " ");
            }

            if(c.authLevelName == "medewerker") { btn_medewerker.Checked = true; }
            else if(c.authLevelName == "gast") { btn_gast.Checked = true; }
            else if(c.authLevelName == "bezoeker") { btn_bezoeker.Checked = true; }
            else if (c.authLevelName == "admin") { btn_admin.Checked = true; }
            else {
                btn_none.Checked = true;
            }
        }

        private async void btn_save_Click(object sender, EventArgs e)
        {
            Debug.WriteLine("Boeking ID" + combox_boekingen.Text.Split("-")[0].Trim());
            await CardApi.UpdateCard(Card.Id, combox_boekingen.Text.Split("-")[0].Trim());
            List<AuthLevel> allAuthLevels = await AuthLevelApi.GetAllAuthLevels();
            if (allAuthLevels != null)
            {
                string? gast_id = allAuthLevels.FirstOrDefault(a => a.Name == "gast")?.Id;
                string? bezoeker_id = allAuthLevels.FirstOrDefault(a => a.Name == "bezoeker")?.Id;
                string? medewerker_id = allAuthLevels.FirstOrDefault(a => a.Name == "medewerker")?.Id;
                string? admin_id = allAuthLevels.FirstOrDefault(a => a.Name == "admin")?.Id;

                if (gast_id != null)
                { if (btn_gast.Checked) { await AuthLevelApi.linkCardAuth(Card.Id, gast_id); } else { await AuthLevelApi.unlinkCardAuth(Card.Id, gast_id); } }
                if (bezoeker_id != null)
                { if (btn_bezoeker.Checked) { await AuthLevelApi.linkCardAuth(Card.Id, bezoeker_id); } else { await AuthLevelApi.unlinkCardAuth(Card.Id, bezoeker_id); } }
                if (medewerker_id != null)
                { if (btn_medewerker.Checked) { await AuthLevelApi.linkCardAuth(Card.Id, medewerker_id); } else { await AuthLevelApi.unlinkCardAuth(Card.Id, medewerker_id); } }
                if (admin_id != null)
                { if (btn_admin.Checked) { await AuthLevelApi.linkCardAuth(Card.Id, admin_id); } else { await AuthLevelApi.unlinkCardAuth(Card.Id, admin_id); } }
            }
            this.Close();
        }
    }
}
