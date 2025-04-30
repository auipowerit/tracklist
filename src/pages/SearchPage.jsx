import { useState } from "react";
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

  return (
    <div className="search-container">
      <Tabs
        tabs={tabs}
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
