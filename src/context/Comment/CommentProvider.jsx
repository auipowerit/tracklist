import { useComment } from "../../hooks/useComment";
import CommentContext from "./CommentContext";

export default function CommentProvder({ children }) {
  const useCommentMethods = useComment();

  const commentMethods = {
    ...useCommentMethods,
  };

  return (
    <CommentContext.Provider value={commentMethods}>
      {children}
    </CommentContext.Provider>
  );
}
