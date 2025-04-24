import { createContext, useContext } from "react";

const CommentContext = createContext();

export function useCommentContext() {
  const context = useContext(CommentContext);

  if (context === undefined) {
    throw new Error(
      "Error! useCommentContext must be used within CommentProvidor.",
    );
  }

  return context;
}

export default CommentContext;
