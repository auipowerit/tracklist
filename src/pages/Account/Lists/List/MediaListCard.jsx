export default function MediaListCard({ title, subtitle, image, index }) {
  return (
    <div>
      <div className="hover: relative border-2 border-transparent transition-all hover:border-white">
        <img src={image} />
        {index && (
          <p className="absolute bottom-0 left-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 p-2 text-xl font-bold">
            {index}
          </p>
        )}
      </div>

      <p className="text-center font-bold text-wrap">{title}</p>
      <p className="text-center text-wrap text-gray-400">[{subtitle}]</p>
    </div>
  );
}
