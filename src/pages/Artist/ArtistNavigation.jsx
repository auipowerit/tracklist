import { Link } from "react-router-dom";

export default function ArtistNavigation({ media, category }) {
  return (
    <div className="flex items-center gap-2 font-bold tracking-wider">
      <Link
        to={`/artists/${media.artist.id}`}
        className={category === "artist" ? "text-green-700" : ""}
      >
        {media.artist.name}
      </Link>

      {media.album && (
        <>
          <span>&#x2022;</span>
          <Link
            to={`/artists/${media.artist.id}/albums/${media.album.id}`}
            className={category === "album" ? "text-green-700" : ""}
          >
            {media.album.name}
          </Link>
          {media.track && (
            <>
              <span>&#x2022;</span>
              <Link
                to={`/artists/${media.artist.id}/albums/${media.album.id}/tracks/${media.track.id}`}
                className={category === "track" ? "text-green-700" : ""}
              >
                {media.track.name}
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
}
