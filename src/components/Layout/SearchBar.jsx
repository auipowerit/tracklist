import { useRef } from "react";
import { useSpotifyContext } from "../../context/Spotify/SpotifyContext";

export default function SearchBar({ setIsLoading, setArtists }) {
  const { searchArtistsByName } = useSpotifyContext();
  const searchInput = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const searchString = searchInput.current?.value.trim();
      if (!searchString) return;

      const fetchedArtists = await searchArtistsByName(searchString);
      setArtists(fetchedArtists);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="mb-8 flex items-center justify-center gap-4"
      onSubmit={handleSubmit}
    >
      <input
        ref={searchInput}
        placeholder="Search for an artist..."
        className="w-1/3 rounded-md border-2 border-white px-2 py-1 text-2xl outline-hidden"
      />
      <button
        type="submit"
        className="rounded-md bg-green-900 px-4 py-2 text-2xl"
      >
        Search
      </button>
    </form>
  );
}
