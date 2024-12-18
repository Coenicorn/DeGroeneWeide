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

namespace DeGroeneWeide
{
    public partial class UC_Scanner : UserControl
    {
        public UC_Scanner()
        {
            InitializeComponent();
        }

        public void Fill(Reader reader)
        {
            if (reader == null)
            {
                return;
            }

            lbl_name.Text = reader.name;

            // Zorgt dat de juiste battery percentage met je juiste image word weergeven.
            switch (reader.battery) {
                case int n when (n > 0 && n <= 12.5):
                    picture_battery.Image = Properties.Resources.battery_0;
                    break;
                case int n when (n > 12.5 && n <= 25):
                    picture_battery.Image = Properties.Resources.battery_1;
                    break;
                case int n when (n > 25 && n <= 37.5):
                    picture_battery.Image = Properties.Resources.battery_2;
                    break;
                case int n when (n > 37.5 && n <= 50):
                    picture_battery.Image = Properties.Resources.battery_3;
                    break;
                case int n when (n > 50 && n <= 62.5):
                    picture_battery.Image = Properties.Resources.battery_4;
                    break;
                case int n when (n > 62.5 && n <= 75):
                    picture_battery.Image = Properties.Resources.battery_5;
                    break;
                case int n when (n > 75 && n <= 87.5):
                    picture_battery.Image = Properties.Resources.battery_6;
                    break;
                case int n when (n > 87.5 && n <= 100):
                    picture_battery.Image = Properties.Resources.battery_full;
                    break;
                default:
                    picture_battery.Image = Properties.Resources.battery_alert;
                    break;
            }

            // Als de reader niet active is een warning laten zien
            if(reader.active == 0)
            {
                picture_warning.Visible = true;
            }
            else
            {
                picture_warning.Visible = false;
            }

            // Zorgt dat de juiste levels van toegang op actief staan (wachten op antwoord over de erd)
        }
    }
}
