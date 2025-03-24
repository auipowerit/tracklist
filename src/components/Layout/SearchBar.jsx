import { useEffect, useRef } from "react";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";
import SortMusicButton from "../Buttons/SortMusicButton";

export default function SearchBar(props) {
  const {
    setIsLoading,
    results,
    setResults,
    category,
    initialResults,
    setInitialResults,
  } = props;

  const { searchByName } = useSpotifyContext();
  const searchInput = useRef(null);

  async function fetchResultsByType(searchString) {
    const fetchedResults = await searchByName(searchString, category);

    const keyMap = {
      artist: "artists",
      album: "albums",
      track: "tracks",
    };

    const key = keyMap[category];
    if (key) {
      const items = fetchedResults?.[key]?.items || [];
      setResults(items);
      setInitialResults([...items]);
    } else {
      setResults([]);
      setInitialResults([]);
    }
  }

  async function handleSubmit(event) {
    event?.preventDefault();

    setIsLoading(true);

    try {
      const searchString = searchInput.current?.value.trim();
      if (!searchString) return;

      await fetchResultsByType(searchString);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (searchInput.current?.value.trim() !== "") {
      handleSubmit();
    }
  }, [category]);

  const placeholderMap = {
    artist: "Ex: 'Hippo Campus'",
    album: "Ex: 'Landmark'",
    track: "Ex: 'Way it Goes'",
  };

  return (
    <div className="mb-8 flex w-full items-center justify-center gap-4">
      <form
        className="flex w-1/3 items-center justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <input
          ref={searchInput}
          placeholder={placeholderMap[category]}
          className="w-full rounded-md border-2 border-white px-2 py-1 text-2xl outline-hidden"
        />
        <button
          type="submit"
          className="rounded-md bg-green-900 px-4 py-2 text-2xl"
        >
          Search
        </button>
      </form>

      <SortMusicButton
        results={results}
        setResults={setResults}
        initialResults={initialResults}
        category={category}
      />
    </div>
  );
}
