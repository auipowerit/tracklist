import "./search-select.scss";

export default function SearchSelect({ activeTab, setActiveTab, setResults }) {
  const handleChange = (e) => {
    setResults(null);
    setActiveTab(e.target.value);
  };

  return (
    <select value={activeTab} onChange={handleChange} className="search-select">
      <option value="artists">Artists</option>
      <option value="albums">Albums</option>
      <option value="tracks">Tracks</option>
      <option value="users">Users</option>
    </select>
  );
}
