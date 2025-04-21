import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ReviewStars } from "src/components/Review/ReviewContent";
import { useReviewContext } from "src/context/Review/ReviewContext";
import Tabs from "src/components/Tabs";
import MediaReviews from "../../compontents/MediaReviews";

export default function AlbumProfile() {
  const context = useOutletContext();
  const { artist, album } = context;

  const [activeTab, setActiveTab] = useState("tracks");
  const tracks = useMemo(() => album?.tracks.items, [album]);

  const tabs = [
    { id: "tracks", label: "Tracks" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="flex h-full w-4/6 flex-col items-center gap-6 py-6">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "reviews" ? (
        <MediaReviews mediaId={album?.id} />
      ) : (
        <TrackList artistId={artist?.id} albumId={album?.id} tracks={tracks} />
      )}
    </div>
  );
}

function TrackList({ artistId, albumId, tracks }) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-80 w-full flex-2 items-start gap-8">
        {tracks && tracks.length > 0 && (
          <ul className="m-auto flex h-screen flex-col gap-4 overflow-auto p-6">
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
      className="flex max-w-120 min-w-120 flex-col gap-2 overflow-hidden border-3 border-white p-2 text-2xl transition-all duration-150 hover:border-green-700"
    >
      <p>
        {track.track_number}. {track.name}
      </p>
      <div className="m-auto">
        <ReviewStars rating={rating?.avgRating || 0} size={30} />
      </div>
    </Link>
  );
}
