import { useState } from "react";
import Loading from "src/components/Loading";
import SortMusic from "src/components/Sort/SortMusic";
import SortUsers from "src/components/Sort/SortUsers";
import SearchBar from "./SearchBar";
import Results from "./Results";

export default function SearchMedia(props) {
  const { category, results, setResults } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [initialResults, setInitialResults] = useState([]);

  return (
    <div>
      <div className="search-header">
        <SearchBar
          category={category}
          setIsLoading={setIsLoading}
          setResults={setResults}
          setInitialResults={setInitialResults}
        />

        <SortResults
          category={category}
          results={results}
          setResults={setResults}
          initialResults={initialResults}
        />
      </div>

      {isLoading && <Loading />}
      <Results results={results} category={category} />
    </div>
  );
}

function SortResults({ category, results, setResults, initialResults }) {
  return (
    <>
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
          search={true}
        />
      )}
    </>
  );
}
