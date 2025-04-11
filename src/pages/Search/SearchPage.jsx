import { useState } from "react";
import Tabs from "src/components/Tabs";
import SearchMedia from "./components/SearchMedia";

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
    <div className="flex flex-col gap-8 p-6">
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
