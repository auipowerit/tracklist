import { useEffect, useRef, useState } from "react";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";
import SortMusic from "../Sort/SortMusic";

export default function SearchBar(props) {
  const {
    setIsLoading,
    results,
    setResults,
    initialResults,
    setInitialResults,
    category,
    getResults,
  } = props;

  const { searchByName } = useSpotifyContext();
  const searchInput = useRef(null);

  async function handleSubmit(event) {
    event?.preventDefault();

    setIsLoading(true);

    try {
      const searchString = searchInput.current?.value.trim();
      if (!searchString) return;

      const fetchedResults = await getResults(searchString);

      setResults(fetchedResults);
      setInitialResults([...fetchedResults]);
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
    account: "Ex: @zbetters97",
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
          className="rounded-md bg-green-900 px-4 py-2 text-2xl transition-all duration-150 hover:text-gray-400"
        >
          Search
        </button>
      </form>

      <SortMusic
        results={results}
        setResults={setResults}
        initialResults={initialResults}
        category={category}
      />
    </div>
  );
}
