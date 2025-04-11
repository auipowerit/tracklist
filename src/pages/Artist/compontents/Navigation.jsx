import { Link } from "react-router-dom";

export default function Navigation({ artist, album, track, category }) {
  return (
    <div className="flex w-fit items-center gap-2 bg-black/40 px-4 py-2 font-bold tracking-wider">
      <NavLink
        link={`/artists/${artist.id}`}
        category={category}
        label="artist"
        title={artist.name}
      />

      {album && (
        <>
          <span>&rsaquo;</span>
          <NavLink
            link={`/artists/${artist.id}/albums/${album.id}`}
            category={category}
            label="album"
            title={album.name}
          />
          {track && (
            <>
              <span>&rsaquo;</span>
              <NavLink
                link={`/artists/${artist.id}/albums/${album.id}/tracks/${track.id}`}
                category={category}
                label="track"
                title={track.name}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

function NavLink({ link, category, label, title }) {
  const ACTIVE_COLOR = "lightblue";

  const isActive = category === label;
  const color = isActive ? ACTIVE_COLOR : "";

  return (
    <Link to={link} style={{ color }}>
      {title}
    </Link>
  );
}
