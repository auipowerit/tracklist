import { memo } from "react";
import { Link } from "react-router-dom";

function ArtistNavigation({ media, category, color }) {
  return (
    <div className="flex w-fit items-center gap-2 bg-black/40 px-4 py-2 font-bold tracking-wider">
      <Link
        to={`/artists/${media?.artist.id}`}
        style={{ color: category === "artist" ? color : "" }}
      >
        {media?.artist.name}
      </Link>

      {media?.album && (
        <>
          <span>&rsaquo;</span>
          <Link
            to={`/artists/${media?.artist.id}/albums/${media?.album.id}`}
            style={{ color: category === "album" ? color : "" }}
          >
            {media?.album.name}
          </Link>
          {media?.track && (
            <>
              <span>&rsaquo;</span>
              <Link
                to={`/artists/${media?.artist.id}/albums/${media?.album.id}/tracks/${media?.track.id}`}
                style={{ color: category === "track" ? color : "" }}
              >
                {media?.track.name}
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default memo(ArtistNavigation);
