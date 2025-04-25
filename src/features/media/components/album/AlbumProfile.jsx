import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Tabs from "src/layouts/Tabs";
import { ReviewStars } from "src/features/review/components/ReviewContent";
import { useReviewContext } from "src/features/review/context/ReviewContext";
import MediaReviews from "../MediaReviews";
import "./album-profile.scss";

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
    <div className="album-profile">
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
    <div className="tracklist-container">
      {tracks && tracks.length > 0 && (
        <div className="tracklist">
          {tracks.map((track) => {
            return (
              <TrackCard
                key={track.id}
                track={track}
                artistId={artistId}
                albumId={albumId}
              />
            );
          })}
        </div>
      )}
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
      className="trackcard"
    >
      <p>
        {track.track_number}. {track.name}
      </p>
      <ReviewStars rating={rating?.avgRating || 0} size={30} />
    </Link>
  );
}
