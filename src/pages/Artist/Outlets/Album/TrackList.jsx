import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReviewStars } from "src/components/Review/ReviewContent";
import { useReviewContext } from "src/context/Review/ReviewContext";

export default function TrackList({ artistId, albumId, tracks }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-4xl font-bold">Tracks</p>

      <div className="flex min-h-80 flex-2 items-start justify-center gap-8">
        {tracks && tracks.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 p-4">
            {tracks.map((track) => {
              return (
                <li key={track.id}>
                  <Link
                    to={`/artists/${artistId}/albums/${albumId}/tracks/${track.id}`}
                  >
                    <TrackCard number={track.track_number} track={track} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

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
