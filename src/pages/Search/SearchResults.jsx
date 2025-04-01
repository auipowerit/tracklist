import { Link } from "react-router-dom";
import UserCard from "src/components/Cards/UserCard";
import MediaCard from "src/components/Cards/MediaCard";

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
        <Link key={result.id} to={getUrl(result)}>
          {category === "user" ? (
            <UserCard user={result} />
          ) : (
            <MediaCard media={result} category={category} />
          )}
        </Link>
      ))}
    </div>
  );
}
