import { memo, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { formatDateMDYLong } from "src/utils/date";
import TrackList from "./TrackList";
import MediaBanner from "../../compontents/MediaBanner";
import { ReviewStars } from "src/components/Review/ReviewContent";

function AlbumProfile() {
  const context = useOutletContext();
  const { artist, album } = context ?? {};

  const tracks = useMemo(() => album?.tracks.items, [album]);

  return (
    <div className="flex min-h-screen flex-2 flex-col gap-8 p-10">
      <div className="m-auto flex w-fit flex-col items-center justify-center gap-8">
        <MediaBanner
          mediaId={album?.id}
          spotifyURL={album?.external_urls.spotify}
          image={album?.images[0].url}
          name={album?.name}
          subtitle={`${album?.tracks.items.length > 0 && album?.tracks.items.length} songs · 
              ${formatDateMDYLong(album?.release_date)}`}
          category={"album"}
        />
      </div>

      <TrackList artistId={artist?.id} albumId={album?.id} tracks={tracks} />
    </div>
  );
}
export default memo(AlbumProfile);

function TrackCard({ number, track }) {
  const { getAvgRating } = useReviewContext();
  const [rating, setRating] = useState({});

  useEffect(() => {
    const fetchRating = async () => {
      const { avgRating, count } = await getAvgRating(track.id);

      setRating({ avgRating, count });
    };

    fetchRating();
  }, []);

  return (
    <div className="flex w-75 flex-col gap-2 border-1 border-white p-2 transition-all duration-150 hover:scale-110">
      {number}. {track.name}
      <div className="m-auto">
        <ReviewStars rating={rating?.avgRating || 0} />
      </div>
    </div>
  );
}
