import "./tabs.scss";

export default function Tabs(props) {
  const { tabs, activeTab, setActiveTab, setResults } = props;

  function handleClick(tab) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setResults && setResults(null);
    setActiveTab(tab.id);
  }

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab)}
          className={`tabs__button ${activeTab === tab.id ? "tabs__button--active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
