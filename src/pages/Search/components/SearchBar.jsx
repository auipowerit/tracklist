import { useEffect, useRef } from "react";
import FormInput from "src/components/Inputs/FormInput";
import { useAuthContext } from "src/context/Auth/AuthContext";
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

  async function handleSearch(event) {
    event?.preventDefault();
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
      className="flex items-center justify-center gap-4"
      onSubmit={handleSearch}
    >
      <FormInput
        ref={searchInput}
        placeholder={placeholderMap[category]}
        classes="rounded-md border-white text-2xl border-2"
      />

      <button
        type="submit"
        className="rounded-md bg-green-700 px-4 py-2 text-2xl transition-all duration-150 hover:text-gray-400"
      >
        Search
      </button>
    </form>
  );
}
