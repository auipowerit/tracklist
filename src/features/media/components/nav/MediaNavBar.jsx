import { Link } from "react-router-dom";
import "./media-navbar.scss";

export default function MediaNavbar({ artist, album, track, category }) {
  return (
    <nav className="media-navbar">
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
    </nav>
  );
}

function NavLink({ link, category, label, title }) {
  const ACTIVE_COLOR = "lightblue";

  const isActive = category === label;
  const color = isActive ? ACTIVE_COLOR : "";

  return (
    <Link to={link} style={{ color }} className="media-navbar__link">
      {title}
    </Link>
  );
}
