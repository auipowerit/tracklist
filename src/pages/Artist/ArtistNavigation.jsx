import { Link } from "react-router-dom";

export default function ArtistNavigation({ media, category, color }) {
  return (
    <div
      className="flex w-fit items-center gap-2 font-bold tracking-wider"
      style={{
        textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Link
        to={`/artists/${media.artist.id}`}
        style={{ color: category === "artist" ? color : "" }}
      >
        {media.artist.name}
      </Link>

      {media.album && (
        <>
          <span>&#x2022;</span>
          <Link
            to={`/artists/${media.artist.id}/albums/${media.album.id}`}
            style={{ color: category === "album" ? color : "" }}
          >
            {media.album.name}
          </Link>
          {media.track && (
            <>
              <span>&#x2022;</span>
              <Link
                to={`/artists/${media.artist.id}/albums/${media.album.id}/tracks/${media.track.id}`}
                style={{ color: category === "track" ? color : "" }}
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
