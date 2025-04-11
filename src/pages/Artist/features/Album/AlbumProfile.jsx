import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ReviewStars } from "src/components/Review/ReviewContent";
import { useReviewContext } from "src/context/Review/ReviewContext";
import MediaBanner from "../../compontents/MediaBanner";

export default function AlbumProfile() {
  const context = useOutletContext();
  const { artist, album } = context;

  const tracks = useMemo(() => album?.tracks.items, [album]);

  return (
    <div className="m-auto flex min-h-screen w-full flex-2 flex-col items-center gap-8 p-10">
      <MediaBanner media={album} category={"album"} />
      <TrackList artistId={artist?.id} albumId={album?.id} tracks={tracks} />
    </div>
  );
}

function TrackList({ artistId, albumId, tracks }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-4xl font-bold">Tracks</p>

      <div className="flex min-h-80 flex-2 items-start justify-center gap-8">
        {tracks && tracks.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 p-4">
            {tracks.map((track) => {
              return (
                <li key={track.id}>
                  <TrackCard
                    track={track}
                    artistId={artistId}
                    albumId={albumId}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function TrackCard({ track, artistId, albumId }) {
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
    <Link
      to={`/artists/${artistId}/albums/${albumId}/tracks/${track.id}`}
      className="flex w-75 flex-col gap-2 border-1 border-white p-2 transition-all duration-150 hover:scale-110"
    >
      {track.track_number}. {track.name}
      <div className="m-auto">
        <ReviewStars rating={rating?.avgRating || 0} />
      </div>
    </Link>
  );
}
