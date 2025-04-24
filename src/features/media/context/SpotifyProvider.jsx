import { useEffect } from "react";
import SpotifyContext from "./SpotifyContext";
import { useSpotify } from "../hooks/useSpotify";

export default function SpotifyProvider({ children }) {
  const spotifyMethods = useSpotify();

  useEffect(() => {
    spotifyMethods.getAccessToken();
  }, []);

  return (
    <SpotifyContext.Provider value={spotifyMethods}>
      {children}
    </SpotifyContext.Provider>
  );
}
