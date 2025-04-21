import { useEffect, useRef } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function SearchBar(props) {
  const { category, setIsLoading, setResults, setInitialResults } = props;

  const { searchByUsername } = useAuthContext();
  const { searchByName } = useSpotifyContext();

  const searchInput = useRef(null);

  const placeholderMap = {
    artist: "Ex: 'Hippo Campus'",
    album: "Ex: 'Landmark'",
    track: "Ex: 'Way it Goes'",
    user: "Ex: 'zbetters97'",
  };

  useEffect(() => {
    const searchString = searchInput.current?.value.trim();
    if (searchString !== "") {
      handleSubmit(searchString.toLowerCase());
    }
  }, [category]);

  async function handleSearch(e) {
    e.preventDefault();

    const searchString = searchInput.current?.value.trim();
    if (!searchString) return;

    await handleSubmit(searchString.toLowerCase());
  }

  async function handleSubmit(searchString) {
    setIsLoading(true);

    try {
      if (category === "user") {
        const users = await searchByUsername(searchString);
        setResults(users);
        setInitialResults([...users]);
        return;
      }

      const media = await searchByName(searchString, category);

      setResults(media?.[`${category}s`]?.items);
      setInitialResults([...media?.[`${category}s`]?.items]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center gap-4 rounded-2xl border-2 border-white px-4 py-2 text-2xl"
    >
      <input
        type="text"
        ref={searchInput}
        placeholder={placeholderMap[category]}
        className="outline-none"
      />

      <button type="submit" className="hover:text-green-700">
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </form>
  );
}
