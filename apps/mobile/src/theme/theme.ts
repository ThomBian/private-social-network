export const theme = {
  colors: {
    // Brand
    primary: "#000000", // Main action buttons
    background: "#FFFFFF", // App background
    papaya: "#FF6B6B", // Accent / Notifications / "Like"

    // Neutrals
    surface: "#F5F5F5", // Light gray backgrounds (inputs, cards)
    text: "#000000", // Main text
    textDim: "#8E8E93", // Subtitles
    border: "#E0E0E0",

    // Feedback
    error: "#FF3B30",
    success: "#34C759",
  },

  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },

  borderRadii: {
    s: 8,
    m: 16,
    l: 24,
    full: 9999, // Circles
  },

  // Consistent font sizing
  typography: {
    h1: { fontSize: 32, fontWeight: "800" as const, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: "700" as const, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
    caption: { fontSize: 12, fontWeight: "500" as const, color: "#8E8E93" },
    button: { fontSize: 16, fontWeight: "600" as const },
  },
};

export type Theme = typeof theme;
