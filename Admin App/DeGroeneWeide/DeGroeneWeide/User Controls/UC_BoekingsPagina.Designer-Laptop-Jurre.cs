using System.Windows.Forms;

namespace DeGroeneWeide.User_Controls
{
    partial class UC_BoekingsPagina
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            flowLayoutPanel1 = new FlowLayoutPanel();
            uC_Boeking1 = new UC_Boeking();
            flowLayoutPanel1.SuspendLayout();
            SuspendLayout();
            // 
            // flowLayoutPanel1
            // 
            flowLayoutPanel1.Controls.Add(uC_Boeking1);
            flowLayoutPanel1.Location = new Point(30, 80);
            flowLayoutPanel1.Name = "flowLayoutPanel1";
            flowLayoutPanel1.Size = new Size(1860, 918);
            flowLayoutPanel1.TabIndex = 0;
            // 
            // uC_Boeking1
            // 
            uC_Boeking1.Location = new Point(3, 3);
            uC_Boeking1.Name = "uC_Boeking1";
            uC_Boeking1.Size = new Size(1860, 100);
            uC_Boeking1.TabIndex = 0;
            // 
            // UC_BoekingsPagina
            // 
            Controls.Add(flowLayoutPanel1);
            Name = "UC_BoekingsPagina";
            Size = new Size(1920, 998);
            flowLayoutPanel1.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private FlowLayoutPanel flowLayoutPanel1;
        private UC_Boeking uC_Boeking1;
    }
}
