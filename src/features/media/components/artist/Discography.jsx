import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import SortMusic from "src/features/sort/components/SortMusic";
import Button from "src/features/shared/components/buttons/Button";
import MediaCard from "src/features/media/components/cards/MediaCard";

export default function Discography({ media, setMedia, isMore, loadMedia }) {
  return (
    <section className="discography">
      <SortMusic
        results={media}
        setResults={setMedia}
        initialResults={media}
        category={"album"}
        search={false}
      />

      <MusicGrid media={media} isMore={isMore} loadMedia={loadMedia} />
    </section>
  );
}

function MusicGrid({ media, isMore, loadMedia }) {
  const [page, setPage] = useState(0);

  if (!media) {
    return;
  }

  if (media.length === 0) {
    return <p className="empty__message">Nothing to show!</p>;
  }

  return (
    <div className="discography__items">
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

      {isMore && (
        <LoadMoreButton loadMedia={loadMedia} page={page} setPage={setPage} />
      )}
    </div>
  );
}

function LoadMoreButton({ loadMedia, page, setPage }) {
  const loadMore = () => {
    const start = (page + 1) * 6;
    loadMedia(start);
    setPage(page + 1);
  };

  return (
    <Button
      onClick={loadMore}
      classes="discography__button"
      ariaLabel="load more music"
    >
      <p>Load more</p>
    </Button>
  );
}
