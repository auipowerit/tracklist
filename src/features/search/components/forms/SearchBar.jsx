import { useEffect, useRef } from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import "./searchbar.scss";

export default function SearchBar(props) {
  const { category, setIsLoading, setResults, setInitialResults } = props;

  const { searchByUser } = useAuthContext();
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
        const users = await searchByUser(searchString);
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
    <form onSubmit={handleSearch} className="searchbar">
      <input
        type="text"
        ref={searchInput}
        placeholder={placeholderMap[category]}
        className="searchbar__input"
      />

      <Button
        type="submit"
        classes="searchbar__submit"
        ariaLabel="submit search"
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </form>
  );
}
