import { Link } from "react-router-dom";
import MediaCard from "src/features/media/components/cards/MediaCard";
import UserCard from "src/features/user/components/cards/UserCard";

export default function SearchResults({ results, category }) {
  if (!results) {
    return;
  }

  if (results.length === 0) {
    return (
      <div className="search-empty">
        <p>No {category}s found!</p>
      </div>
    );
  }

  return (
    <div className={`search-results ${category !== "user" && "media-results"}`}>
      {results.map((result) => (
        <ResultCard
          key={result.id || result.uid}
          result={result}
          category={category}
        />
      ))}
    </div>
  );
}

function ResultCard({ result, category }) {
  function getUrl(result) {
    switch (result.type) {
      case "artist":
        return `/artists/${result.id}`;
      case "album":
        return `/artists/${result.artists[0].id}/albums/${result.id}`;
      case "track":
        return `/artists/${result.artists[0].id}/albums/${result.album.id}/tracks/${result.id}`;
      default:
        return `/users/${result.username}`;
    }
  }

  return (
    <>
      {category === "user" ? (
        <UserCard user={result} />
      ) : (
        <Link to={getUrl(result)}>
          <MediaCard media={result} category={category} />
        </Link>
      )}
    </>
  );
}
