import { Link } from "react-router-dom";
import MediaCard from "src/components/Cards/MediaCard";
import ProfileCard from "src/components/Cards/ProfileCard";

export default function SearchResults({ results, category }) {
  const classes =
    category === "user"
      ? "m-auto w-fit"
      : "m-auto grid w-fit grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  function getUrl(result) {
    switch (result.type) {
      case "artist":
        return `/artists/${result.id}`;
      case "album":
        return `/artists/${result.artists[0].id}/albums/${result.id}`;
      case "track":
        return `/artists/${result.artists[0].id}/albums/${result.album.id}/tracks/${result.id}`;
      default:
        return `/users/${result.id}`;
    }
  }

  if (!results) {
    return;
  }

  if (results.length === 0) {
    return (
      <div className="m-auto w-fit py-20">
        <p className="text-4xl italic">No {category}s found!</p>
      </div>
    );
  }

  return (
    <div className={classes}>
      {results.map((result) => (
        <div key={result.id}>
          {category === "user" ? (
            <ProfileCard user={result} />
          ) : (
            <Link to={getUrl(result)}>
              <MediaCard media={result} category={category} />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
