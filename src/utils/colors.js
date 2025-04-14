import { Vibrant } from "node-vibrant/browser";

export async function getColors(profileUrl) {
  const palette = await getPalette(profileUrl);

  return {
    light: palette.Muted,
    dark: palette.DarkMuted,
    text: palette.LightVibrant,
  };
}

async function getPalette(src) {
  const palette = await new Vibrant(src).getPalette();

  const formattedPalette = Object.keys(palette).reduce((acc, key) => {
    acc[key] = palette[key].hex;
    return acc;
  }, {});

  return formattedPalette;
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
