import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import MediaCard from "../Cards/MediaCard";
import SearchBar from "./SearchBar";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function SearchMusic(props) {
  const { category, results, setResults } = props;

  const { searchByName } = useSpotifyContext();
  const [isLoading, setIsLoading] = useState(false);
  const [initialResults, setInitialResults] = useState([]);

  async function getMediaByType(searchString) {
    const fetchedResults = await searchByName(searchString, category);

    const keyMap = {
      artist: "artists",
      album: "albums",
      track: "tracks",
    };

    const key = keyMap[category];
    if (key) {
      const items = fetchedResults?.[key]?.items || [];
      return items;
    } else {
      return [];
    }
  }

  return (
    <div>
      <SearchBar
        setIsLoading={setIsLoading}
        results={results}
        setResults={setResults}
        initialResults={initialResults}
        setInitialResults={setInitialResults}
        category={category}
        getResults={getMediaByType}
      />

      {isLoading && <Loading />}
      <SearchResults results={results} category={category} />
    </div>
  );
}

function SearchResults({ results, category }) {
  if (!results) {
    return;
  }

  if (results.length === 0) {
    return <p>No {category} found!</p>;
  }

  return (
    <div className="m-auto grid w-fit grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {results.map((result) => (
        <Link key={result.id} to={`/${category}s/${result.id}`}>
          <MediaCard media={result} category={category} />
        </Link>
      ))}
    </div>
  );
}
