import Button from "./Button";
import "./tabs.scss";

export default function Tabs(props) {
  const { tabs, activeTab, setActiveTab, setResults } = props;

  function handleClick(tab) {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    setResults && setResults(null);
    setActiveTab(tab.id);
  }

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => handleClick(tab)}
          classes="tabs__button"
          ariaSelected={activeTab === tab.id}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
