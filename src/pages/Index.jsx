import { useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Artist from "../components/Artist";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState([]);

  if (isLoading) {
    return (
      <div className="h-full w-full py-2 text-center">
        <Header />
        <SearchBar setIsLoading={setIsLoading} setArtists={setArtists} />

        <div className="flex h-[80vh] w-full flex-col justify-center gap-4 py-2 text-center align-middle text-5xl">
          <FontAwesomeIcon icon={faSpinner} spin />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full py-2 text-center">
      <Header />
      <SearchBar setIsLoading={setIsLoading} setArtists={setArtists} />

      {artists && artists.length > 0 ? (
        <div className="m-auto grid w-fit grid-cols-4 gap-10">
          {artists.map((artist) => {
            return (
              <Link key={artist.id} to={`/artists/${artist.id}`}>
                <Artist artist={artist} />
              </Link>
            );
          })}
        </div>
      ) : (
        !artists && <p>No artists found!</p>
      )}
    </div>
  );
}
