import { Link } from "react-router-dom";
import TrackCard from "./TrackCard";

export default function TrackList({ artistId, albumId, tracks }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-4xl font-bold">Tracks</p>

      {tracks && tracks.length > 0 ? (
        <ul className="flex flex-col gap-4">
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
      ) : (
        <p className="p-20 text-center text-5xl italic">Nothing to show!</p>
      )}
    </div>
  );
}
