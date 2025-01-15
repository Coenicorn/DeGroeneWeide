using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeGroeneWeide
{
    internal static class Colors
    {
        // Basis
        public static readonly Color Text = Color.FromArgb(26, 46, 28);
        public static readonly Color Cross = Color.FromArgb(255, 0, 0);
        public static readonly Color Panel = Color.FromArgb(201, 234, 203);
        public static readonly Color TopBar = Color.FromArgb(172, 225, 175);

        // Background Colors
        public static readonly Color WhiteBackground = Color.FromArgb(248, 248, 248);
        public static readonly Color Background = Color.FromArgb(224, 251, 226);

        // AuthLevels Colors
        public static readonly Color Gast = Color.FromArgb(12, 201, 34);
        public static readonly Color Bezoeker = Color.FromArgb(12, 97, 201);
        public static readonly Color MedeWerker = Color.FromArgb(238, 152, 14);
        public static readonly Color Admin = Color.FromArgb(120, 121, 120);
    }
}
