import { Link } from "react-router-dom";
import TrackCard from "./TrackCard";

export default function TrackList({ artistId, albumId, tracks }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-4xl font-bold">Tracks</p>

      <div className="flex flex-2 items-start justify-center gap-8">
        {tracks && tracks.length > 0 ? (
          <ul className="flex flex-col gap-4 overflow-auto p-6">
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
    </div>
  );
}
