import Loading from "../components/Loading";
import ReviewList from "../components/Reviews/ReviewList";
import { useAuthContext } from "../context/Auth/AuthContext";
import { useReviewContext } from "../context/Review/ReviewContext";

export default function HomePage() {
  const { globalUser } = useAuthContext();
  const { reviews } = useReviewContext();

  if (!globalUser) {
    return (
      <div className="m-auto w-1/3 py-20">
        <p className="text-center text-2xl">
          Login to your account to view the latest reviews from the friends you
          follow!
        </p>
      </div>
    );
  }

  if (!reviews) {
    return <Loading />;
  }

  return <ReviewList />;
}
