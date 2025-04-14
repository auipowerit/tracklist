import { Vibrant } from "node-vibrant/browser";

export async function getPalette(src) {
  const palette = await new Vibrant(src).getPalette();

  const formattedPalette = Object.keys(palette).reduce((acc, key) => {
    acc[key] = palette[key].hex;
    return acc;
  }, {});

  return formattedPalette;
}
