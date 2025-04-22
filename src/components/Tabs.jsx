import "src/styles/components/tabs.scss";

export default function Tabs(props) {
  const { tabs, activeTab, setActiveTab, setResults } = props;

  function handleClick(tab) {
    setResults && setResults(null);
    setActiveTab(tab.id);
  }

  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${
            activeTab === tab.id
              && "active-tab"
          }`}
          onClick={() => handleClick(tab)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
