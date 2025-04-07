import { getPalette } from "react-palette";

export async function getColors(profileUrl) {
  const palette = await getPalette(profileUrl);

  return {
    light: palette.muted,
    dark: palette.darkMuted,
    text: palette.lightVibrant,
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
