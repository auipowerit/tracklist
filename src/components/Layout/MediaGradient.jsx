import { useEffect, useState } from "react";
import { getColors } from "src/utils/colors";

export default function MediaGradient({ image }) {
  const [colors, setColors] = useState({ light: "#ffffff", dark: "#000000" });

  useEffect(() => {
    const fetchColors = async () => {
      if (!image) return;
      const colors = await getColors(image);
      setColors(colors);
    };
    fetchColors();
  }, [image]);

  return (
    <div
      className="moving-gradient"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `linear-gradient(to bottom right, ${colors.light}, ${colors.dark})`,
        filter: "blur(100px)",
        zIndex: -1,
      }}
    />
  );
}
