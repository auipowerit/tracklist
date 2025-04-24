export default function ListCard({ image, name, length, description }) {
  return (
    <div className="border-box flex cursor-pointer gap-4">
      <img src={image} className="h-48 w-48 object-cover" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <p className="text-2xl font-bold">{name}</p>
          <p className="text-gray-400">
            {length === 0 ? "No" : length} {length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}
