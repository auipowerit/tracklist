import { useRef } from "react";
import { useSpotifyContext } from "../context/Spotify/SpotifyContext";

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
      className="m-auto my-5 flex w-fit justify-center gap-4 align-middle"
      onSubmit={handleSubmit}
    >
      <input
        ref={searchInput}
        placeholder="Search for an artist..."
        className="border-2 border-white px-2 py-1 text-2xl"
      />
      <button
        type="submit"
        className="rounded-full bg-green-900 px-4 py-2 text-2xl"
      >
        Search
      </button>
    </form>
  );
}
