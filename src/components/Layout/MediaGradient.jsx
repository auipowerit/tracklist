export default function MediaGradient({ light, dark }) {
  return (
    <div
      className="moving-gradient"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `linear-gradient(to bottom right, ${light}, ${dark})`,
        filter: "blur(100px)",
        zIndex: -1,
      }}
    />
  );
}
