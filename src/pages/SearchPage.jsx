import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import SearchBar from "../components/Layout/SearchBar";
import ArtistCard from "../components/Cards/ArtistCard";
import SortArtistButton from "../components/Buttons/SortArtistButton";

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState([]);

  if (isLoading) {
    return (
      <div className="p-6">
        <SearchBar setIsLoading={setIsLoading} setArtists={setArtists} />
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6">
      <SearchBar setIsLoading={setIsLoading} setArtists={setArtists} />

      {artists && artists.length > 0 ? (
        <>
          <SortArtistButton artists={artists} setArtists={setArtists} />

          <div className="m-auto grid w-fit grid-cols-4 gap-10">
            {artists.map((artist) => {
              return (
                <Link key={artist.id} to={`/artists/${artist.id}`}>
                  <ArtistCard artist={artist} />
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        !artists && <p>No artists found!</p>
      )}
    </div>
  );
}
