import { useState } from "react";
import Loading from "../Loading";
import SearchBar from "./SearchBar";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { Link } from "react-router-dom";

export default function SearchAccounts(props) {
  const { results, setResults } = props;
  const { searchUsersByUsername } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [initialResults, setInitialResults] = useState([]);

  async function searchAccount(searchString) {
    const users = await searchUsersByUsername(searchString);
    return users;
  }

  return (
    <div>
      <SearchBar
        setIsLoading={setIsLoading}
        results={results}
        setResults={setResults}
        initialResults={initialResults}
        setInitialResults={setInitialResults}
        category={"account"}
        getResults={searchAccount}
      />

      {isLoading && <Loading />}
      <SearchResults results={results} />
    </div>
  );
}

function SearchResults({ results }) {
  if (!results) {
    return;
  }

  if (results.length === 0) {
    return <p>No account found!</p>;
  }

  return (
    <div className="m-auto grid w-fit grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {results.map((result) => (
        <Link key={result.id} to={`/accounts/${result.id}`}>
          <p key={result.id}>{result.username}</p>
        </Link>
      ))}
    </div>
  );
}
