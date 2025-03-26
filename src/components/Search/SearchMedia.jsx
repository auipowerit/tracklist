import { useState } from "react";
import Loading from "../Loading";
import SearchBar from "./SearchBar";
import SortMusic from "../Sort/SortMusic";
import SortUsers from "../Sort/SortUsers";
import SearchResults from "./SearchResults";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function SearchMedia(props) {
  const { category, results, setResults } = props;

  const { searchByUsername } = useAuthContext();
  const { searchByName } = useSpotifyContext();
  const [isLoading, setIsLoading] = useState(false);
  const [initialResults, setInitialResults] = useState([]);

  async function handleSubmit(searchString) {
    setIsLoading(true);

    try {
      if (category === "user") {
        const users = await searchByUsername(searchString);
        setResults(users);
        setInitialResults([...users]);
        return;
      }

      const media = await searchByName(searchString, category);

      setResults(media?.[`${category}s`]?.items);
      setInitialResults([...media?.[`${category}s`]?.items]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex w-full items-center justify-center gap-4">
        <SearchBar category={category} handleSubmit={handleSubmit} />

        {category === "user" ? (
          <SortUsers
            users={results}
            setUsers={setResults}
            initialUsers={initialResults}
            category={category}
          />
        ) : (
          <SortMusic
            results={results}
            setResults={setResults}
            initialResults={initialResults}
            category={category}
          />
        )}
      </div>

      {isLoading && <Loading />}
      <SearchResults results={results} category={category} />
    </div>
  );
}
