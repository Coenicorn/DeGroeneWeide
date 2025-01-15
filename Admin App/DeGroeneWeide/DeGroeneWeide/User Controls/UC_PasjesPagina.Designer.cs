namespace DeGroeneWeide
{
    partial class UC_PasjesPagina
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(UC_PasjesPagina));
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            cards_container = new FlowLayoutPanel();
            btn_plus = new Guna.UI2.WinForms.Guna2ImageButton();
            guna2ImageButton2 = new Guna.UI2.WinForms.Guna2ImageButton();
            guna2ImageButton3 = new Guna.UI2.WinForms.Guna2ImageButton();
            SuspendLayout();
            // 
            // cards_container
            // 
            cards_container.AutoScroll = true;
            cards_container.BackColor = Color.Transparent;
            cards_container.Location = new Point(31, 82);
            cards_container.Name = "cards_container";
            cards_container.Size = new Size(1872, 920);
            cards_container.TabIndex = 1;
            // 
            // btn_plus
            // 
            btn_plus.CheckedState.ImageSize = new Size(64, 64);
            btn_plus.HoverState.ImageSize = new Size(50, 50);
            btn_plus.Image = (Image)resources.GetObject("btn_plus.Image");
            btn_plus.ImageOffset = new Point(0, 0);
            btn_plus.ImageRotate = 0F;
            btn_plus.ImageSize = new Size(48, 48);
            btn_plus.Location = new Point(1839, 13);
            btn_plus.Name = "btn_plus";
            btn_plus.PressedState.ImageSize = new Size(52, 52);
            btn_plus.ShadowDecoration.CustomizableEdges = customizableEdges1;
            btn_plus.Size = new Size(48, 48);
            btn_plus.TabIndex = 2;
            // 
            // guna2ImageButton2
            // 
            guna2ImageButton2.CheckedState.ImageSize = new Size(64, 64);
            guna2ImageButton2.HoverState.ImageSize = new Size(50, 50);
            guna2ImageButton2.Image = (Image)resources.GetObject("guna2ImageButton2.Image");
            guna2ImageButton2.ImageOffset = new Point(0, 0);
            guna2ImageButton2.ImageRotate = 0F;
            guna2ImageButton2.ImageSize = new Size(48, 48);
            guna2ImageButton2.Location = new Point(1699, 13);
            guna2ImageButton2.Name = "guna2ImageButton2";
            guna2ImageButton2.PressedState.ImageSize = new Size(52, 52);
            guna2ImageButton2.ShadowDecoration.CustomizableEdges = customizableEdges2;
            guna2ImageButton2.Size = new Size(48, 48);
            guna2ImageButton2.TabIndex = 3;
            // 
            // guna2ImageButton3
            // 
            guna2ImageButton3.CheckedState.ImageSize = new Size(64, 64);
            guna2ImageButton3.HoverState.ImageSize = new Size(50, 50);
            guna2ImageButton3.Image = (Image)resources.GetObject("guna2ImageButton3.Image");
            guna2ImageButton3.ImageOffset = new Point(0, 0);
            guna2ImageButton3.ImageRotate = 0F;
            guna2ImageButton3.ImageSize = new Size(48, 48);
            guna2ImageButton3.Location = new Point(1769, 13);
            guna2ImageButton3.Name = "guna2ImageButton3";
            guna2ImageButton3.PressedState.ImageSize = new Size(52, 52);
            guna2ImageButton3.ShadowDecoration.CustomizableEdges = customizableEdges3;
            guna2ImageButton3.Size = new Size(48, 48);
            guna2ImageButton3.TabIndex = 4;
            // 
            // UC_PasjesPagina
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(224, 251, 226);
            Controls.Add(guna2ImageButton3);
            Controls.Add(guna2ImageButton2);
            Controls.Add(btn_plus);
            Controls.Add(cards_container);
            Margin = new Padding(2);
            Name = "UC_PasjesPagina";
            Size = new Size(1920, 998);
            ResumeLayout(false);
        }

        #endregion
        private FlowLayoutPanel cards_container;
        private Guna.UI2.WinForms.Guna2ImageButton btn_plus;
        private Guna.UI2.WinForms.Guna2ImageButton guna2ImageButton2;
        private Guna.UI2.WinForms.Guna2ImageButton guna2ImageButton3;
    }
}
