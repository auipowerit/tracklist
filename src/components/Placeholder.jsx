export default function Placeholder({ width = "100px", height = "20px" }) {
  return (
    <div
      className={`placeholder m-2 animate-pulse bg-gray-500`}
      style={{ width: width, height: height }}
    ></div>
  );
}
