import { Link } from "react-router-dom";
import { formatDateMDYLong } from "../../utils/date";
import SortMusic from "../../components/Sort/SortMusic";
import MediaCard from "../../components/Cards/MediaCard";

export default function MediaList({ media, setMedia, category }) {
  const title = `${category.charAt(0).toUpperCase()}${category.slice(1)}s`;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-4 flex w-fit items-center gap-4 border-b-2 border-white pr-10 pb-2">
        <p className="text-4xl font-bold">{title}</p>

        <SortMusic
          results={media}
          setResults={setMedia}
          initialResults={media}
          category={category}
          search={false}
        />
      </div>

      {media && media.length > 0 ? (
        <div className="grid w-fit gap-8 gap-x-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {media.map((music) => {
            const artistId = music.artists?.[0]?.id || "";

            return (
              <Link
                key={music.id}
                to={`/artists/${artistId}/albums/${music.id}`}
              >
                <MediaCard
                  key={music.id}
                  media={music}
                  defaultSubtitle={formatDateMDYLong(music.release_date)}
                  category={category}
                />
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
