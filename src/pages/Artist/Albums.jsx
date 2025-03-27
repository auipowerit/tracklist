import SortMusic from "../../components/Sort/SortMusic";
import MediaCard from "../../components/Cards/MediaCard";
import { Link } from "react-router-dom";

export default function Albums({ artist, albums, setAlbums }) {
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
              <Link
                key={album.id}
                to={`/artists/${artist.id}/albums/${album.id}`}
              >
                <MediaCard key={album.id} media={album} category={"album"} />
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="p-20 text-center text-5xl italic">Nothing to show!</p>
      )}
    </div>
  );
}
