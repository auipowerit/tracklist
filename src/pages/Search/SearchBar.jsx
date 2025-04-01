import { useEffect, useRef } from "react";
import FormInput from "src/components/Inputs/FormInput";

export default function SearchBar(props) {
  const { category, handleSubmit } = props;

  const searchInput = useRef(null);

  async function handleSearch(event) {
    event?.preventDefault();
    const searchString = searchInput.current?.value.trim();
    if (!searchString) return;

    await handleSubmit(searchString);
  }

  useEffect(() => {
    const searchString = searchInput.current?.value.trim();
    if (searchString !== "") {
      handleSubmit(searchString);
    }
  }, [category]);

  const placeholderMap = {
    artist: "Ex: 'Hippo Campus'",
    album: "Ex: 'Landmark'",
    track: "Ex: 'Way it Goes'",
    user: "Ex: 'zbetters97'",
  };

  return (
    <form
      className="flex w-1/3 items-center justify-center gap-4"
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
