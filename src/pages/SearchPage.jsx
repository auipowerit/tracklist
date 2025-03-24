import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import SearchBar from "../components/Layout/SearchBar";
import ArtistCard from "../components/Cards/ArtistCard";

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState(null);

  return (
    <div className="p-6">
      <SearchBar
        setIsLoading={setIsLoading}
        artists={artists}
        setArtists={setArtists}
      />

      {isLoading ? <Loading /> : <SearchResults artists={artists} />}
    </div>
  );
}

function SearchResults({ artists }) {
  if (!artists) {
    return;
  }

  if (artists.length === 0) {
    return <p>No artists found!</p>;
  }

  return (
    <div className="m-auto grid w-fit grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {artists.map((artist) => (
        <Link key={artist.id} to={`/artists/${artist.id}`}>
          <ArtistCard artist={artist} />
        </Link>
      ))}
    </div>
  );
}
