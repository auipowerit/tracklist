import { useState } from "react";
import SearchTabs from "../components/Search/SearchTabs";
import SearchMusic from "../components/Search/SearchMusic";
import SearchAccounts from "../components/Search/SearchAccounts";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("artists");
  const [results, setResults] = useState(null);

  const tabs = [
    { id: "artists", label: "Artists", category: "artist" },
    { id: "albums", label: "Albums", category: "album" },
    { id: "songs", label: "Songs", category: "track" },
    { id: "account", label: "Accounts", category: "account" },
  ];

  return (
    <div className="flex flex-col gap-8 p-6">
      <SearchTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setResults={setResults}
      />

      {activeTab === "account" ? (
        <SearchAccounts results={results} setResults={setResults} />
      ) : (
        <SearchMusic
          category={tabs.find((tab) => tab.id === activeTab)?.category}
          results={results}
          setResults={setResults}
        />
      )}
    </div>
  );
}
