import SortButton from "./buttons/SortButton";

export default function SortMusic(props) {
  const {
    results,
    setResults,
    initialResults,
    category,
    search = false,
  } = props;

  const sortOptions = [
    ...(search ? [{ label: "Relevance", value: "relevant" }] : []),
    ...(search
      ? category === "artist" || category === "track"
        ? [{ label: "Popularity", value: "popular" }]
        : []
      : []),
    ...(search
      ? category === "album" || category === "track"
        ? [{ label: "Artist", value: "artist" }]
        : []
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

  function sortMethod(sortValue) {
    if (sortValue === "relevant") {
      return [...initialResults];
    }

    return results.sort((a, b) => {
      switch (sortValue) {
        case "popular":
          return b.popularity - a.popularity;
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
  }

  return (
    <SortButton
      results={results}
      setResults={setResults}
      sortOptions={sortOptions}
      sortMethod={sortMethod}
    />
  );
}
