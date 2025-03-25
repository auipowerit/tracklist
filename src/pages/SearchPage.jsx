import { useState } from "react";
import SearchTabs from "../components/Search/SearchTabs";
import SearchMedia from "../components/Search/SearchMedia";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("artists");
  const [results, setResults] = useState(null);

  const tabs = [
    { id: "artists", label: "Artists", category: "artist" },
    { id: "albums", label: "Albums", category: "album" },
    { id: "tracks", label: "Songs", category: "track" },
    { id: "users", label: "Users", category: "user" },
  ];

  return (
    <div className="flex flex-col gap-8 p-6">
      <SearchTabs
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
