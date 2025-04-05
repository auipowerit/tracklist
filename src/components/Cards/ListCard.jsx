export default function ListCard({ image, name, length, description }) {
  return (
    <div className="border-box mt-6 flex cursor-pointer gap-4">
      <img src={image} className="w-46" />
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
