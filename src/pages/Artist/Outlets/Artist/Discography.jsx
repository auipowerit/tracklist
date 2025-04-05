import { Link } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import SortMusic from "src/components/Sort/SortMusic";
import MediaCard from "src/components/Cards/MediaCard";
import { useState } from "react";

export default function Discography({
  media,
  setMedia,
  loadMedia,
  category,
  isMore,
}) {
  const title = `${category.charAt(0).toUpperCase()}${category.slice(1)}s`;

  const [page, setPage] = useState(0);

  function loadMore() {
    const start = (page + 1) * 6;
    loadMedia(start, category);
    setPage(page + 1);
  }

  return (
    <div className="flex w-full flex-col">
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

      {media &&
        (media.length > 0 ? (
          <div className="grid h-full w-fit gap-8 gap-x-8 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
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

            {isMore && (
              <div className="flex h-72 items-center justify-center">
                <button
                  onClick={loadMore}
                  className="m-auto h-fit w-fit rounded-md bg-green-700 p-4 text-2xl"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="p-20 text-center text-5xl italic">Nothing to show!</p>
        ))}
    </div>
  );
}
