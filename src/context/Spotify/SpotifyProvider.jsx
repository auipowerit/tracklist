import { useEffect } from "react";
import SpotifyContext from "./SpotifyContext";
import { useSpotify } from "../../hooks/useSpotify";

export default function SpotifyProvider({ children }) {
  const spotifyMethods = useSpotify();

  useEffect(() => {
    spotifyMethods.fetchAccessToken();
  }, []);

  return (
    // Provide useContext with authDBmethods
    <SpotifyContext.Provider value={spotifyMethods}>
      {children}
    </SpotifyContext.Provider>
  );
}
