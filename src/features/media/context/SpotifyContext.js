import { createContext, useContext } from "react";

const SpotifyContext = createContext();

export function useSpotifyContext() {
  const context = useContext(SpotifyContext);

  if (context === undefined) {
    throw new Error(
      "Error! useSpotifyContext must be used within SpotifyProvidor.",
    );
  }

  return context;
}

export default SpotifyContext;
