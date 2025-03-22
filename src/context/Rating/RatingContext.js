import { createContext, useContext } from "react";

const RatingContext = createContext();

export function useRatingContext() {
  const context = useContext(RatingContext);

  if (context === undefined) {
    throw new Error(
      "Error! useRatingContext must be used within RatingProvidor.",
    );
  }

  return context;
}

export default RatingContext;
