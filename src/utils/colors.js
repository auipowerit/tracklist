import { getPalette } from "react-palette";

export async function getColors(imageURL) {
  const palette = await getPalette(imageURL);

  return {
    light: palette.vibrant,
    dark: palette.lightMuted,
    text: palette.lightMuted,
  };
}

export async function getColorPalette(imageURL) {
  const palette = await getPalette(imageURL);
  const colorPalette = Object.keys(palette).map((key) => {
    return {
      name: key,
      color: palette[key],
    };
  });

  return colorPalette;
}
