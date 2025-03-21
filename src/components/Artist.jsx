export default function Artist({ artist, onClick }) {
  const imgSource =
    artist.images !== null && artist.images.length > 0
      ? artist.images[0].url
      : "https://i.scdn.co/image/ab6761610000e5ebed00a732f4a1fffa76678858";

  return (
    <div
      className="my-2 flex h-[400px] w-[300px] cursor-pointer flex-col justify-between bg-white align-middle text-black transition-all duration-200 hover:scale-110"
      onClick={onClick}
    >
      <div className="flex h-full flex-col justify-between gap-2 py-2 text-center">
        <p className="text-2xl font-bold">{artist.name}</p>
        <p className="text-sm font-light">
          {artist.followers.total.toLocaleString()}{" "}
          {artist.followers.total === 1 ? "Follower" : "Followers"}
        </p>
      </div>
      <img src={imgSource} className="h-[300px] w-[300px]" />
    </div>
  );
}
