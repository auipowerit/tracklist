import { useEffect, useState } from "react";
import { useSpotify } from "../../hooks/useSpotify";
import SpotifyContext from "./SpotifyContext";

export default function SpotifyProvider({ children }) {
  const {
    fetchAccessToken,
    searchArtistsByName,
    searchArtistById,
    getArtistAlbums,
    getArtistSingles,
  } = useSpotify();

  useEffect(() => {
    const getAccessToken = async () => {
      await fetchAccessToken();
    };

    getAccessToken();
  }, []);

  const spotifyMethods = {
    searchArtistsByName,
    searchArtistById,
    getArtistAlbums,
    getArtistSingles,
  };

  return (
    // Provide useContext with authDBmethods
    <SpotifyContext.Provider value={spotifyMethods}>
      {children}
    </SpotifyContext.Provider>
  );
}
