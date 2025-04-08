export default function MediaListCard({ title, subtitle, image, index }) {
  return (
    <div className="w-48">
      <div className="relative">
        <img src={image} className="h-48 w-48 object-cover" />
        {index && (
          <p className="absolute bottom-0 left-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 p-2 text-xl font-bold">
            {index}
          </p>
        )}
      </div>

      <p className="text-center font-bold text-wrap">{title}</p>
      {subtitle && (
        <p className="text-center text-wrap text-gray-400">[{subtitle}]</p>
      )}
    </div>
  );
}
