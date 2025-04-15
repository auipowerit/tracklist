import { useEffect, useMemo, useState } from "react";
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
          <ul className="grid w-full grid-cols-4 gap-4 p-4">
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
      className="flex max-w-75 flex-col gap-2 border-1 border-white p-2 transition-all duration-150 hover:scale-110"
    >
      {track.track_number}. {track.name}
      <div className="m-auto">
        <ReviewStars rating={rating?.avgRating || 0} />
      </div>
    </Link>
  );
}
