import { Link } from "react-router-dom";
import TrackCard from "./TrackCard";

export default function TrackList({ artistId, albumId, tracks }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-4xl font-bold">Tracks</p>

      <div className="flex flex-2 items-start justify-center gap-8">
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
