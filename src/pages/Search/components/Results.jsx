import { Link } from "react-router-dom";
import MediaCard from "src/components/Cards/MediaCard";
import ProfileCard from "src/components/Cards/ProfileCard";

export default function Results({ results, category }) {
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
    <div
      className={`m-auto w-fit ${
        category !== "user" &&
        "grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      {results.map((result) => (
        <ResultCard key={result.id} result={result} category={category} />
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
        return `/users/${result.id}`;
    }
  }

  return (
    <>
      {category === "user" ? (
        <ProfileCard user={result} />
      ) : (
        <Link to={getUrl(result)}>
          <MediaCard media={result} category={category} />
        </Link>
      )}
    </>
  );
}
