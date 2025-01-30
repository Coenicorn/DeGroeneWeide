﻿namespace DeGroeneWeide
{
    partial class MainForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
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

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges7 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges8 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges4 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges5 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges6 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            topbar = new Guna.UI2.WinForms.Guna2Panel();
            btn_BoekingsPagina = new Guna.UI2.WinForms.Guna2Button();
            btn_PasjesPagina = new Guna.UI2.WinForms.Guna2Button();
            btn_ScannersPagina = new Guna.UI2.WinForms.Guna2Button();
            pagina_container = new FlowLayoutPanel();
            topbar.SuspendLayout();
            SuspendLayout();
            // 
            // topbar
            // 
            topbar.BackColor = Color.FromArgb(172, 225, 175);
            topbar.Controls.Add(btn_BoekingsPagina);
            topbar.Controls.Add(btn_PasjesPagina);
            topbar.Controls.Add(btn_ScannersPagina);
            topbar.CustomBorderColor = Color.FromArgb(172, 225, 175);
            topbar.CustomBorderThickness = new Padding(0, 0, 3, 0);
            topbar.CustomizableEdges = customizableEdges7;
            topbar.Location = new Point(0, 0);
            topbar.Margin = new Padding(2);
            topbar.Name = "topbar";
            topbar.ShadowDecoration.CustomizableEdges = customizableEdges8;
            topbar.Size = new Size(1920, 30);
            topbar.TabIndex = 1;
            // 
            // btn_BoekingsPagina
            // 
            btn_BoekingsPagina.BorderColor = Color.Empty;
            btn_BoekingsPagina.ButtonMode = Guna.UI2.WinForms.Enums.ButtonMode.RadioButton;
            btn_BoekingsPagina.CheckedState.BorderColor = Color.FromArgb(224, 251, 226);
            btn_BoekingsPagina.CheckedState.CustomBorderColor = Color.Transparent;
            btn_BoekingsPagina.CheckedState.FillColor = Color.FromArgb(224, 251, 226);
            btn_BoekingsPagina.CustomBorderThickness = new Padding(2, 2, 2, 0);
            btn_BoekingsPagina.CustomizableEdges = customizableEdges1;
            btn_BoekingsPagina.DisabledState.BorderColor = Color.DarkGray;
            btn_BoekingsPagina.DisabledState.CustomBorderColor = Color.DarkGray;
            btn_BoekingsPagina.DisabledState.FillColor = Color.DarkGray;
            btn_BoekingsPagina.DisabledState.ForeColor = Color.DarkGray;
            btn_BoekingsPagina.FillColor = Color.Empty;
            btn_BoekingsPagina.Font = new Font("Microsoft Sans Serif", 10.125F, FontStyle.Bold, GraphicsUnit.Point, 0);
            btn_BoekingsPagina.ForeColor = Color.FromArgb(26, 46, 28);
            btn_BoekingsPagina.Location = new Point(219, 5);
            btn_BoekingsPagina.Margin = new Padding(2);
            btn_BoekingsPagina.Name = "btn_BoekingsPagina";
            btn_BoekingsPagina.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btn_BoekingsPagina.Size = new Size(100, 25);
            btn_BoekingsPagina.TabIndex = 5;
            btn_BoekingsPagina.Text = "Boekingen";
            btn_BoekingsPagina.Click += btn_BoekingsPagina_Click;
            // 
            // btn_PasjesPagina
            // 
            btn_PasjesPagina.BorderColor = Color.Empty;
            btn_PasjesPagina.ButtonMode = Guna.UI2.WinForms.Enums.ButtonMode.RadioButton;
            btn_PasjesPagina.Checked = true;
            btn_PasjesPagina.CheckedState.BorderColor = Color.FromArgb(224, 251, 226);
            btn_PasjesPagina.CheckedState.CustomBorderColor = Color.Transparent;
            btn_PasjesPagina.CheckedState.FillColor = Color.FromArgb(224, 251, 226);
            btn_PasjesPagina.CustomBorderThickness = new Padding(2, 2, 2, 0);
            btn_PasjesPagina.CustomizableEdges = customizableEdges3;
            btn_PasjesPagina.DisabledState.BorderColor = Color.DarkGray;
            btn_PasjesPagina.DisabledState.CustomBorderColor = Color.DarkGray;
            btn_PasjesPagina.DisabledState.FillColor = Color.DarkGray;
            btn_PasjesPagina.DisabledState.ForeColor = Color.DarkGray;
            btn_PasjesPagina.FillColor = Color.Empty;
            btn_PasjesPagina.Font = new Font("Microsoft Sans Serif", 10.125F, FontStyle.Bold);
            btn_PasjesPagina.ForeColor = Color.FromArgb(26, 46, 28);
            btn_PasjesPagina.Location = new Point(11, 5);
            btn_PasjesPagina.Margin = new Padding(2);
            btn_PasjesPagina.Name = "btn_PasjesPagina";
            btn_PasjesPagina.ShadowDecoration.CustomizableEdges = customizableEdges4;
            btn_PasjesPagina.Size = new Size(100, 25);
            btn_PasjesPagina.TabIndex = 0;
            btn_PasjesPagina.Text = "Pasjes";
            btn_PasjesPagina.Click += btn_PasjesPagina_Click;
            // 
            // btn_ScannersPagina
            // 
            btn_ScannersPagina.BorderColor = Color.Empty;
            btn_ScannersPagina.ButtonMode = Guna.UI2.WinForms.Enums.ButtonMode.RadioButton;
            btn_ScannersPagina.CheckedState.BorderColor = Color.FromArgb(224, 251, 226);
            btn_ScannersPagina.CheckedState.CustomBorderColor = Color.Transparent;
            btn_ScannersPagina.CheckedState.FillColor = Color.FromArgb(224, 251, 226);
            btn_ScannersPagina.CustomBorderThickness = new Padding(2, 2, 2, 0);
            btn_ScannersPagina.CustomizableEdges = customizableEdges5;
            btn_ScannersPagina.DisabledState.BorderColor = Color.DarkGray;
            btn_ScannersPagina.DisabledState.CustomBorderColor = Color.DarkGray;
            btn_ScannersPagina.DisabledState.FillColor = Color.DarkGray;
            btn_ScannersPagina.DisabledState.ForeColor = Color.DarkGray;
            btn_ScannersPagina.FillColor = Color.Empty;
            btn_ScannersPagina.Font = new Font("Microsoft Sans Serif", 10.125F, FontStyle.Bold, GraphicsUnit.Point, 0);
            btn_ScannersPagina.ForeColor = Color.FromArgb(26, 46, 28);
            btn_ScannersPagina.Location = new Point(115, 5);
            btn_ScannersPagina.Margin = new Padding(2);
            btn_ScannersPagina.Name = "btn_ScannersPagina";
            btn_ScannersPagina.ShadowDecoration.CustomizableEdges = customizableEdges6;
            btn_ScannersPagina.Size = new Size(100, 25);
            btn_ScannersPagina.TabIndex = 1;
            btn_ScannersPagina.Text = "Scanners";
            btn_ScannersPagina.Click += btn_ScannersPagina_Click;
            // 
            // pagina_container
            // 
            pagina_container.BackColor = Color.Transparent;
            pagina_container.Location = new Point(0, 32);
            pagina_container.Margin = new Padding(0);
            pagina_container.Name = "pagina_container";
            pagina_container.Size = new Size(900, 600);
            pagina_container.TabIndex = 2;
            pagina_container.Paint += pagina_container_Paint;
            // 
            // MainForm
            // 
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(224, 251, 226);
            ClientSize = new Size(900, 600);
            Controls.Add(pagina_container);
            Controls.Add(topbar);
            Icon = (Icon)resources.GetObject("$this.Icon");
            Margin = new Padding(2);
            Name = "MainForm";
            RightToLeft = RightToLeft.No;
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Administratie - Shoco Mellow";
            topbar.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private Guna.UI2.WinForms.Guna2Panel topbar;
        private Guna.UI2.WinForms.Guna2Button btn_BoekingsPagina;
        private Guna.UI2.WinForms.Guna2Button btn_ScannersPagina;
        private Guna.UI2.WinForms.Guna2Button btn_PasjesPagina;
        private FlowLayoutPanel pagina_container;
    }
}
