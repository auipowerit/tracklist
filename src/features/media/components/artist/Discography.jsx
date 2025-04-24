import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import SortMusic from "src/features/sort/components/SortMusic";
import MediaCard from "src/features/media/components/cards/MediaCard";

export default function Discography({ media, setMedia, isMore, loadMedia }) {
  const [page, setPage] = useState(0);

  return (
    <div className="flex w-full flex-col justify-center gap-6">
      <SortMusic
        results={media}
        setResults={setMedia}
        initialResults={media}
        category={"album"}
        search={false}
      />

      {media &&
        (media.length > 0 ? (
          <div className="flex h-full w-full flex-wrap justify-start gap-8">
            <MediaItems media={media} />

            {isMore && (
              <LoadMoreButton
                loadMedia={loadMedia}
                page={page}
                setPage={setPage}
              />
            )}
          </div>
        ) : (
          <p className="p-20 text-center text-5xl italic">Nothing to show!</p>
        ))}
    </div>
  );
}

function MediaItems({ media }) {
  return (
    <>
      {media.map((music) => {
        const artistId = music.artists?.[0]?.id || "";

        return (
          <Link key={music.id} to={`/artists/${artistId}/albums/${music.id}`}>
            <MediaCard
              key={music.id}
              media={music}
              defaultSubtitle={formatDateMDYLong(music.release_date)}
            />
          </Link>
        );
      })}
    </>
  );
}

function LoadMoreButton({ loadMedia, page, setPage }) {
  function loadMore() {
    const start = (page + 1) * 6;
    loadMedia(start);
    setPage(page + 1);
  }

  return (
    <div className="flex h-72 items-center justify-center">
      <button
        onClick={loadMore}
        className="m-auto h-fit w-fit rounded-md bg-green-700 p-4 text-2xl"
      >
        Load more
      </button>
    </div>
  );
}
