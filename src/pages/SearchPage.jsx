import { useEffect, useState } from "react";
import Tabs from "src/layouts/buttons/Tabs";
import SearchMedia from "src/features/search/components/SearchMedia";
import "./styles/search.scss";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("artists");
  const [results, setResults] = useState(null);

  const tabs = [
    { id: "artists", label: "Artists", category: "artist" },
    { id: "albums", label: "Albums", category: "album" },
    { id: "tracks", label: "Tracks", category: "track" },
    { id: "users", label: "Users", category: "user" },
  ];

  useEffect(() => {
    setResults(null);
  }, [activeTab]);

  return (
    <div className="search">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setResults={setResults}
      />

      <SearchSelect
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setResults={setResults}
      />

      <SearchMedia
        category={tabs.find((tab) => tab.id === activeTab)?.category}
        results={results}
        setResults={setResults}
      />
    </div>
  );
}

function SearchSelect({ activeTab, setActiveTab, setResults }) {
  function handleChange(e) {
    setResults(null);
    setActiveTab(e.target.value);
  }

  return (
    <select value={activeTab} onChange={handleChange} className="search__select">
      <option value="artists">Artists</option>
      <option value="albums">Albums</option>
      <option value="tracks">Tracks</option>
      <option value="users">Users</option>
    </select>
  );
}
