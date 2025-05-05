import { useState } from "react";
import Loading from "src/features/shared/components/Loading";
import SortMusic from "src/features/sort/components/SortMusic";
import SortUsers from "src/features/sort/components/SortUsers";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

export default function SearchMedia(props) {
  const { category, results, setResults } = props;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Header
        category={category}
        setIsLoading={setIsLoading}
        results={results}
        setResults={setResults}
      />

      {isLoading && <Loading />}
      <SearchResults results={results} category={category} />
    </div>
  );
}

function Header({ category, setIsLoading, results, setResults }) {
  const [initialResults, setInitialResults] = useState([]);

  return (
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
