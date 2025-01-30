using DeGroeneWeide.Forms;
using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DeGroeneWeide.User_Controls
{
    public partial class UC_Boeking : UserControl
    {
        private Booking? Booking;
        private UC_BoekingsPagina? Pagina;
        public UC_Boeking()
        {
            InitializeComponent();
        }

        public void FillInfo(Booking booking, UC_BoekingsPagina boekingsPagina)
        {
            Booking = booking; Pagina = boekingsPagina;
            lbl_Aankomst.Text = booking.StartDate.ToString("dd-MM-yyyy");
            lbl_Vertrek.Text = booking.EndDate.ToString("dd-MM-yyyy");
            lbl_AantalMensen.Text = booking.AmountPeople.ToString();
            string name = $"{booking.FirstName} {booking.MiddleName} {booking.LastName}";
            lbl_Naam.Text = name.Replace("  ", " ");
            lbl_Email.Text = booking.Email;
            lbl_Nummer.Text = booking.PhoneNumber;
            lbl_id.Text = booking.Id;
        }

        private void btn_edit_Click(object sender, EventArgs e)
        {
            Edit_Boeking edit = new();
            if (Booking != null) { edit.FillInfo(Booking); }
            edit.ShowDialog();
            if (Pagina != null) { Pagina.LoadInfo(); }
        }

        private void lbl_Naam_Click(object sender, EventArgs e)
        {

        }
    }
}
