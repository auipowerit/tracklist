export default function ListItemCard(props) {
  const { title, subtitle, image, index, orientation = 0 } = props;

  return (
    <div
      className={`flex border-1 border-transparent hover:border-white ${orientation === 0 ? "flex-col gap-1" : "items-start gap-4 text-2xl"}`}
    >
      <div className="relative flex items-start gap-2">
        {index && (
          <p
            className={`flex h-9 w-9 items-center justify-center bg-green-900 p-2 text-xl font-bold shadow-md shadow-black/75 ${orientation === 0 && "absolute bottom-0 left-0"}`}
          >
            {index}
          </p>
        )}
        <img src={image} className="h-48 w-48 object-cover" />
      </div>

      <div className="flex flex-col">
        <p
          className={`font-bold text-wrap ${orientation === 0 && "text-center"}`}
        >
          {title}
        </p>
        {subtitle && (
          <p className="text-center text-wrap text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
