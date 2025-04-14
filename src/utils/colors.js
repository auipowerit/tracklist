import { getPalette } from "./getPalette";

export async function getColors(profileUrl) {
  const palette = await getPalette(profileUrl);

  return {
    light: palette.Muted,
    dark: palette.DarkMuted,
    text: palette.LightVibrant,
  };
}

export async function getColorPalette(profileUrl) {
  const palette = await getPalette(profileUrl);

  const colorPalette = Object.keys(palette).map((key) => {
    return {
      name: key,
      color: palette[key],
    };
  });

  return colorPalette;
}
