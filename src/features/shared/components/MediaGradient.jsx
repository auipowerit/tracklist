import { memo, useEffect, useState } from "react";
import { getColors } from "src/utils/colors";
import "./styles/gradient.scss";

function MediaGradient({ image }) {
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
        backgroundImage: `linear-gradient(to bottom right, ${colors.light}, ${colors.dark})`,
      }}
    />
  );
}

export default memo(MediaGradient);
