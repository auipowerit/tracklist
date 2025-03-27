import { useEffect, useRef, useState } from "react";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    function handleClickOutside(event) {
      if (sorterRef.current && !sorterRef.current.contains(event.target)) {
        setShowSort(false);
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={sorterRef} className="relative z-20 w-fit">
      <button
        onClick={() => results?.length > 0 && setShowSort(!showSort)}
        className="flex cursor-pointer items-center gap-2 text-xl"
      >
        <FontAwesomeIcon icon={faSort} />
        <p>Sort by</p>
      </button>

      <div
        className={`absolute top-10 left-0 w-fit overflow-hidden rounded-lg bg-white text-black shadow-lg transition-all duration-300 ease-in-out ${
          showSort ? "max-h-screen p-2" : "max-h-0"
        }`}
      >
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => sortResults(option.value)}
            className="w-full rounded-sm px-3 py-1 text-left transition-all hover:bg-gray-300"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
