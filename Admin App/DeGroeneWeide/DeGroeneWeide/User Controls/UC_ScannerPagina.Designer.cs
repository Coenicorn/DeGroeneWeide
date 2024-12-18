namespace DeGroeneWeide
{
    partial class UC_ScannerPagina
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
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            scanner_container = new FlowLayoutPanel();
            uC_Scanner1 = new UC_Scanner();
            uC_Scanner2 = new UC_Scanner();
            uC_Scanner3 = new UC_Scanner();
            uC_Scanner4 = new UC_Scanner();
            btn_refresh = new Guna.UI2.WinForms.Guna2ImageButton();
            scanner_container.SuspendLayout();
            SuspendLayout();
            // 
            // scanner_container
            // 
            scanner_container.AutoScroll = true;
            scanner_container.BackColor = Color.Transparent;
            scanner_container.Controls.Add(uC_Scanner1);
            scanner_container.Controls.Add(uC_Scanner2);
            scanner_container.Controls.Add(uC_Scanner3);
            scanner_container.Controls.Add(uC_Scanner4);
            scanner_container.Location = new Point(31, 82);
            scanner_container.Name = "scanner_container";
            scanner_container.Size = new Size(1872, 920);
            scanner_container.TabIndex = 2;
            // 
            // uC_Scanner1
            // 
            uC_Scanner1.BackColor = Color.Transparent;
            uC_Scanner1.Location = new Point(3, 3);
            uC_Scanner1.Name = "uC_Scanner1";
            uC_Scanner1.Size = new Size(330, 220);
            uC_Scanner1.TabIndex = 0;
            // 
            // uC_Scanner2
            // 
            uC_Scanner2.BackColor = Color.Transparent;
            uC_Scanner2.Location = new Point(339, 3);
            uC_Scanner2.Name = "uC_Scanner2";
            uC_Scanner2.Size = new Size(330, 220);
            uC_Scanner2.TabIndex = 1;
            // 
            // uC_Scanner3
            // 
            uC_Scanner3.BackColor = Color.Transparent;
            uC_Scanner3.Location = new Point(675, 3);
            uC_Scanner3.Name = "uC_Scanner3";
            uC_Scanner3.Size = new Size(330, 220);
            uC_Scanner3.TabIndex = 2;
            // 
            // uC_Scanner4
            // 
            uC_Scanner4.BackColor = Color.Transparent;
            uC_Scanner4.Location = new Point(1011, 3);
            uC_Scanner4.Name = "uC_Scanner4";
            uC_Scanner4.Size = new Size(330, 220);
            uC_Scanner4.TabIndex = 3;
            // 
            // btn_refresh
            // 
            btn_refresh.CheckedState.ImageSize = new Size(64, 64);
            btn_refresh.HoverState.ImageSize = new Size(64, 64);
            btn_refresh.Image = Properties.Resources.refresh;
            btn_refresh.ImageOffset = new Point(0, 0);
            btn_refresh.ImageRotate = 0F;
            btn_refresh.Location = new Point(1830, 13);
            btn_refresh.Name = "btn_refresh";
            btn_refresh.PressedState.ImageSize = new Size(64, 64);
            btn_refresh.ShadowDecoration.CustomizableEdges = customizableEdges1;
            btn_refresh.Size = new Size(64, 54);
            btn_refresh.TabIndex = 3;
            btn_refresh.Click += btn_refresh_Click;
            // 
            // UC_ScannerPagina
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.Transparent;
            Controls.Add(btn_refresh);
            Controls.Add(scanner_container);
            Name = "UC_ScannerPagina";
            Size = new Size(1920, 998);
            scanner_container.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private FlowLayoutPanel scanner_container;
        private UC_Scanner uC_Scanner1;
        private UC_Scanner uC_Scanner2;
        private UC_Scanner uC_Scanner3;
        private UC_Scanner uC_Scanner4;
        private Guna.UI2.WinForms.Guna2ImageButton btn_refresh;
    }
}
