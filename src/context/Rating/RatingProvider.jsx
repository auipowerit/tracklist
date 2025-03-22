import RatingContext from "./RatingContext";
import { useRating } from "../../hooks/useRating";

export default function RatingProvider({ children }) {
  const ratingMethods = useRating();

  return (
    // Provide useContext with authDBmethods
    <RatingContext.Provider value={ratingMethods}>
      {children}
    </RatingContext.Provider>
  );
}
