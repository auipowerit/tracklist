import { Link } from "react-router-dom";
import UserCard from "../../components/Cards/UserCard";
import MediaCard from "../../components/Cards/MediaCard";

export default function SearchResults({ results, category }) {
  const classes =
    category === "user"
      ? "m-auto w-fit"
      : "m-auto grid w-fit grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

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
        <Link key={result.id} to={`/${category}s/${result.id}`}>
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
