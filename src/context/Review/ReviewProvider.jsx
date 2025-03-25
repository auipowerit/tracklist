import ReviewContext from "./ReviewContext";
import { useReview } from "../../hooks/useReview";

export default function ReviewProvider({ children }) {
  const ReviewMethods = useReview();

  return (
    // Provide useContext with authDBmethods
    <ReviewContext.Provider value={ReviewMethods}>
      {children}
    </ReviewContext.Provider>
  );
}
