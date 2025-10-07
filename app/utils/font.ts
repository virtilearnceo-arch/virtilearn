// utils/fonts.ts
export async function loadFonts() {
  const font = new FontFace(
    "Open Sans",
    "url(https://fonts.gstatic.com/s/opensans/v34/mem8YaGs126MiZpBA-UFVZ0e.ttf)"
  );

  await font.load();
  (document as any).fonts.add(font);
}
