/**
 * Shared "kids app" palette for PythonKid's public marketing pages.
 * Each color is a full chip: soft pastel background, saturated text/icon
 * color, and a matching soft border — the same recipe Duolingo/Khan Academy
 * Kids use for colorful, friendly UI chips.
 *
 * Import PALETTE and cycle through it (PALETTE[i % PALETTE.length]) for any
 * repeating list of cards/icons so the page reads as playful and varied
 * rather than monochrome.
 */
export const PALETTE = [
  { name: "coral", bg: "#FFF1EC", text: "#FF5A36", border: "#FFD3C2", solid: "#FF5A36" },
  { name: "sky", bg: "#EAF8FE", text: "#1AACDB", border: "#BEEBF9", solid: "#1AACDB" },
  { name: "grass", bg: "#EAFBF1", text: "#1FB671", border: "#BDEFD3", solid: "#1FB671" },
  { name: "sun", bg: "#FFF8E1", text: "#E8A400", border: "#FCE29B", solid: "#E8A400" },
  { name: "grape", bg: "#F5EEFF", text: "#8B5CF6", border: "#DFCBFF", solid: "#8B5CF6" },
  { name: "bubble", bg: "#FFEEF6", text: "#EC4899", border: "#FBC7E0", solid: "#EC4899" },
];

// Primary brand color for CTAs/logo — the "coral" chip's solid value, kept
// as its own export so it reads clearly at call sites.
export const BRAND = "#FF5A36";
export const BRAND_SOFT = "#FFF1EC";

/**
 * Injects the two Google Fonts used across the public site:
 * Baloo 2 (chunky, rounded — headings) and Nunito (friendly, rounded — body).
 * Drop <FontLoader /> once near the top of any public page.
 */
export function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap');
      .font-display { font-family: 'Baloo 2', 'Nunito', sans-serif; }
      .font-body { font-family: 'Nunito', sans-serif; }
    `}</style>
  );
}