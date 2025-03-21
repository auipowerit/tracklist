import { formatDateMDYLong } from "../utils/date";

export default function Album({ album }) {
  return (
    <div className="my-2 flex h-[400px] w-[300px] cursor-pointer flex-col justify-between bg-white align-middle text-black transition-all duration-200 hover:scale-110">
      <div className="flex h-full flex-col justify-between gap-2 py-2 text-center">
        <p className="text-2xl font-bold">{album.name}</p>
        <p className="text-sm font-light">
          {formatDateMDYLong(album.release_date)}
        </p>
      </div>
      <img src={album.images[0].url} className="h-[300px] w-[300px]" />
    </div>
  );
}
