import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import SortMusic from "src/components/Sort/SortMusic";
import MediaCard from "src/components/Cards/MediaCard";

export default function Discography(props) {
  return (
    <div className="flex w-full flex-col items-center">
      <MediaList {...props} />
    </div>
  );
}

function Header({ title, media, setMedia, category }) {
  return (
    <div className="mb-4 flex w-fit items-center justify-between gap-6 border-b-2 border-white pb-2">
      <p className="text-4xl font-bold">{title}</p>

      <SortMusic
        results={media}
        setResults={setMedia}
        initialResults={media}
        category={category}
        search={false}
      />
    </div>
  );
}

function MediaList({ media, setMedia, isMore, loadMedia }) {
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
          <div className="flex h-full w-full flex-wrap justify-center gap-8">
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
