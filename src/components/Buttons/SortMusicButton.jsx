import { useEffect, useRef, useState } from "react";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SortMusicButton(props) {
  const { results, setResults, initialResults, category } = props;

  const [showSort, setShowSort] = useState(false);
  const sorterRef = useRef(null);

  const sortOptions = [
    { label: "Relevance", value: "relevant" },
    ...(category === "artist" || category === "track"
      ? [{ label: "Popularity", value: "popular" }]
      : []),
    ...(category === "artist"
      ? [{ label: "Followers", value: "followers" }]
      : []),
    ...(category === "album" || category === "track"
      ? [{ label: "Artist", value: "artist" }]
      : []),
    ...(category === "album" || category === "track"
      ? [{ label: "Newest", value: "newest" }]
      : []),
    ...(category === "album" || category === "track"
      ? [{ label: "Oldest", value: "oldest" }]
      : []),
    { label: "A - Z", value: "alphabet" },
    { label: "Z - A", value: "rev-alphabet" },
  ];

  function sortResults(sortValue) {
    const sortedResults = results.sort((a, b) => {
      switch (sortValue) {
        case "popular":
          return b.popularity - a.popularity;
        case "followers":
          return b.followers.total - a.followers.total;
        case "artist":
          const artistComparison = a.artists[0].name.localeCompare(
            b.artists[0].name,
          );
          if (artistComparison !== 0) return artistComparison;
          return (
            new Date(b.album?.release_date || b.release_date) -
            new Date(a.album?.release_date || a.release_date)
          );
        case "newest":
          return (
            new Date(b.album?.release_date || b.release_date) -
            new Date(a.album?.release_date || a.release_date)
          );
        case "oldest":
          return (
            new Date(a.album?.release_date || a.release_date) -
            new Date(b.album?.release_date || b.release_date)
          );
        case "alphabet":
          return a.name.localeCompare(b.name);
        case "rev-alphabet":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    sortValue === "relevant"
      ? setResults([...initialResults])
      : setResults([...sortedResults]);

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
