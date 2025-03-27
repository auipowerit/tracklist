import SortMusic from "../../components/Sort/SortMusic";
import MediaCard from "../../components/Cards/MediaCard";

export default function AlbumsList({ albums, setAlbums }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <p className="text-4xl font-bold">Albums</p>

        <SortMusic
          results={albums}
          setResults={setAlbums}
          initialResults={albums}
          category={"album"}
        />
      </div>

      {albums && albums.length > 0 ? (
        <div className="grid grid-cols-3 gap-8">
          {albums.map((album) => {
            return (
              <MediaCard key={album.id} media={album} category={"album"} />
            );
          })}
        </div>
      ) : (
        <p className="p-20 text-center text-5xl italic">Nothing to show!</p>
      )}
    </div>
  );
}
