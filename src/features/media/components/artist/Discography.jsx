import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import SortMusic from "src/features/sort/components/SortMusic";
import MediaCard from "src/features/media/components/cards/MediaCard";

export default function Discography({ media, setMedia, isMore, loadMedia }) {
  const [page, setPage] = useState(0);

  return (
    <div className="discography-container">
      <SortMusic
        results={media}
        setResults={setMedia}
        initialResults={media}
        category={"album"}
        search={false}
      />

      {media &&
        (media.length > 0 ? (
          <div className="discography">
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
          <p className="empty-message">Nothing to show!</p>
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
    <div className="load-more">
      <button onClick={loadMore} className="load-more-btn">
        Load more
      </button>
    </div>
  );
}
