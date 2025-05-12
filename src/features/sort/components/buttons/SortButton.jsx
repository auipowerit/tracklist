import { useEffect, useRef, useState } from "react";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./sort-button.scss";

export default function SortButton(props) {
  const { results, setResults, sortOptions, sortMethod } = props;

  const [showSort, setShowSort] = useState(false);
  const sorterRef = useRef(null);

  function sortResults(sortValue) {
    const sortedResults = sortMethod(sortValue);
    setResults([...sortedResults]);

    setShowSort(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (sorterRef.current && !sorterRef.current.contains(e.target)) {
        setShowSort(false);
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={sorterRef} className="sort">
      <button
        onClick={() => results?.length > 0 && setShowSort(!showSort)}
        className="sort__button"
      >
        <FontAwesomeIcon icon={faSort} />
        <p>Sort by</p>
      </button>

      <div
        className={`sort__dropdown ${showSort ? "sort__dropdown--active" : ""}`}
      >
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => sortResults(option.value)}
            className="sort__item"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
