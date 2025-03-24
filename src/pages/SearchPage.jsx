import { useState } from "react";
import SearchMusic from "../components/SearchMusic";
import SearchTabs from "../components/Buttons/SearchTabs";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("artists");
  const [results, setResults] = useState(null);
  const [initialResults, setInitialResults] = useState([]);

  const tabs = [
    { id: "artists", label: "Artists", category: "artist" },
    { id: "albums", label: "Albums", category: "album" },
    { id: "songs", label: "Songs", category: "track" },
  ];

  return (
    <div className="flex flex-col gap-8 p-6">
      <SearchTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setResults={setResults}
        initialResults={initialResults}
        setInitialResults={setInitialResults}
      />

      <SearchMusic
        category={tabs.find((tab) => tab.id === activeTab)?.category}
        results={results}
        setResults={setResults}
        initialResults={initialResults}
        setInitialResults={setInitialResults}
      />
    </div>
  );
}
