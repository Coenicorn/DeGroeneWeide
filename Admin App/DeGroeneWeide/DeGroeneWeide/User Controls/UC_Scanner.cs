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
using DeGroeneWeide.ApiCalls;
using DeGroeneWeide.Objects;

namespace DeGroeneWeide
{
    public partial class UC_Scanner : UserControl
    {
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

        public void Fill(Reader reader)
        {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            if (reader == null)
=======
            if (reader == null || reader.Id == null)
>>>>>>> Stashed changes
=======
            if (reader == null || reader.Id == null)
>>>>>>> Stashed changes
=======
            if (reader == null || reader.Id == null)
>>>>>>> Stashed changes
            {
                return;
            }

            lbl_name.Text = reader.Name;

            // Als de reader niet active is een warning laten zien
            if(reader.Active == 0)
            {
                picture_warning.Visible = true;
            }
            else
            {
                picture_warning.Visible = false;
            }

<<<<<<< Updated upstream
            // Zorgt dat de juiste levels van toegang op actief staan (wachten op antwoord over de erd)
=======
            // Zorgt dat de juiste levels van toegang op actief staan
            List<AuthLevel> authLevels = await AuthLevelApi.GetAllAuthLevels(reader.Id);
            int i = 0;
            foreach (AuthLevel authLevel in authLevels)
            {
                Debug.WriteLine(authLevel.Name + " - " + authLevel.Id);
                switch (authLevel.Name)
                {
                    case "Gast": i++; Debug.WriteLine("Gast is actief"); break;
                    case "Bezoeker": i++; Debug.WriteLine("Bezoeker is actief"); break;
                    case "Medewerker": i++; Debug.WriteLine("Medewerker is actief"); break;
                    case "Administrator": i++; Debug.WriteLine("Administrator is actief"); break;
                    default: continue;

                }
            }

>>>>>>> Stashed changes
        }
    }
}
