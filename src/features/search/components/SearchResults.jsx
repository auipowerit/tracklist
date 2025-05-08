import { Link } from "react-router-dom";
import MediaCard from "src/features/media/components/cards/MediaCard";
import UserCard from "src/features/user/components/cards/UserCard";
import "./search-results.scss";

export default function SearchResults({ results, category }) {
  if (!results) {
    return;
  }

  if (results.length === 0) {
    return <p className="empty__message">No {category}s found!</p>;
  }

  return (
    <div
      className={`search-results ${category === "user" ? "serach-results--users" : "search-results--media"}`}
    >
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
