import { Link } from "react-router-dom";

export default function ArtistNavigation({ media, category, color }) {
  return (
    <div className="flex w-fit items-center gap-2 rounded-md bg-[rgba(20,20,20,0.6)] px-2 py-1 font-bold tracking-wider">
      <Link
        to={`/artists/${media.artist.id}`}
        style={{ color: category === "artist" ? color : "" }}
      >
        {media.artist.name}
      </Link>

      {media.album && (
        <>
          <span>&rsaquo;</span>
          <Link
            to={`/artists/${media.artist.id}/albums/${media.album.id}`}
            style={{ color: category === "album" ? color : "" }}
          >
            {media.album.name}
          </Link>
          {media.track && (
            <>
              <span>&rsaquo;</span>
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
