// One outlined identity for the website, browser tab, and saved home screen.
// The T is the shared trunk; the two B counters open away from it.
export const BRAND_IDENTITY = {
  ink: "#1F3A28",
  cream: "#F2F0E8",
  sand: "#C6A97A",
  // Optical crop and extra stroke weight keep the serif details visible in tabs.
  iconViewBox: "4 10 88 92",
  iconStrokeWidth: 1.8,
  upper: "M39 17H51C68 17 79 25 79 38C79 49 69 56 51 56H39V51H49C61 51 68 46 68 37C68 28 61 22 50 22H39Z",
  lower: "M39 51H52C73 51 84 58 84 71C84 86 71 94 50 94H39V89H49C65 89 72 83 72 72C72 62 65 56 50 56H39Z",
  trunk: "M10 17H60L63 31H60C56 23 53 22 40 22V79C40 89 42 91 50 92V95H18V92C26 91 28 89 28 79V22C18 22 15 25 12 31H9Z",
  trace: "M10 18H51C68 18 78 25 78 38C78 49 68 53 51 53C72 53 82 59 82 72C82 86 70 93 50 93H20",
} as const;
