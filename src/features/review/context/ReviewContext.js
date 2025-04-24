import { createContext, useContext } from "react";

const ReviewContext = createContext();

export function useReviewContext() {
  const context = useContext(ReviewContext);

  if (context === undefined) {
    throw new Error(
      "Error! useReviewContext must be used within ReviewProvidor.",
    );
  }

  return context;
}

export default ReviewContext;
