import { useEffect, useState } from "react";
import Tabs from "src/features/shared/components/buttons/Tabs";
import Loading from "src/features/shared/components/Loading";
import SortUsers from "src/features/sort/components/SortUsers";
import SortMusic from "src/features/sort/components/SortMusic";
import SearchBar from "src/features/search/components/forms/SearchBar";
import SearchResults from "src/features/search/components/SearchResults";
import SearchSelect from "src/features/search/components/inputs/SearchSelect";
import "./search.scss";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("artists");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: "artists", label: "Artists", category: "artist" },
    { id: "albums", label: "Albums", category: "album" },
    { id: "tracks", label: "Tracks", category: "track" },
    { id: "users", label: "Users", category: "user" },
  ];

  const category = tabs.find((tab) => tab.id === activeTab)?.category;

  useEffect(() => {
    setResults(null);
  }, [activeTab]);

  return (
    <section className="search">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setResults={setResults}
      />

      <Header
        category={category}
        setIsLoading={setIsLoading}
        results={results}
        setResults={setResults}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {isLoading && <Loading />}
      <SearchResults results={results} category={category} />
    </section>
  );
}

function Header(props) {
  const {
    category,
    setIsLoading,
    results,
    setResults,
    activeTab,
    setActiveTab,
  } = props;

  const [initialResults, setInitialResults] = useState([]);

  return (
    <div className="search__header">
      <SearchBar
        category={category}
        setIsLoading={setIsLoading}
        setResults={setResults}
        setInitialResults={setInitialResults}
      />

      <div className="search__options">
        <SearchSelect
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setResults={setResults}
        />

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
      </div>
    </div>
  );
}
