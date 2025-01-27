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
            cards_container = new FlowLayoutPanel();
            btn_refresh = new Guna.UI2.WinForms.Guna2ImageButton();
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
            // btn_refresh
            // 
            btn_refresh.CheckedState.ImageSize = new Size(64, 64);
            btn_refresh.HoverState.ImageSize = new Size(50, 50);
            btn_refresh.Image = (Image)resources.GetObject("btn_refresh.Image");
            btn_refresh.ImageOffset = new Point(0, 0);
            btn_refresh.ImageRotate = 0F;
            btn_refresh.ImageSize = new Size(48, 48);
            btn_refresh.Location = new Point(1855, 12);
            btn_refresh.Name = "btn_refresh";
            btn_refresh.PressedState.ImageSize = new Size(52, 52);
            btn_refresh.ShadowDecoration.CustomizableEdges = customizableEdges1;
            btn_refresh.Size = new Size(48, 48);
            btn_refresh.TabIndex = 3;
            btn_refresh.Click += btn_refresh_Click;
            // 
            // UC_PasjesPagina
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(224, 251, 226);
            Controls.Add(btn_refresh);
            Controls.Add(cards_container);
            Margin = new Padding(2);
            Name = "UC_PasjesPagina";
            Size = new Size(1920, 998);
            ResumeLayout(false);
        }

        #endregion
        private FlowLayoutPanel cards_container;
        private Guna.UI2.WinForms.Guna2ImageButton btn_refresh;
    }
}
