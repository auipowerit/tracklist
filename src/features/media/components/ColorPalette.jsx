export default function ColorPalette({ palette }) {
  return (
    <div className="flex gap-2">
      {palette &&
        palette.map((color) => {
          return (
            <div
              key={color.name}
              style={{
                backgroundColor: color.color,
                padding: 5,
                height: 50,
              }}
            >
              {color.name}
            </div>
          );
        })}
    </div>
  );
}
