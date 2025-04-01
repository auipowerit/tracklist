import { useEffect } from "react";
import SpotifyContext from "./SpotifyContext";
import { useSpotify } from "src/hooks/useSpotify";

export default function SpotifyProvider({ children }) {
  const spotifyMethods = useSpotify();

  useEffect(() => {
    spotifyMethods.fetchAccessToken();
  }, []);

  return (
    <SpotifyContext.Provider value={spotifyMethods}>
      {children}
    </SpotifyContext.Provider>
  );
}
