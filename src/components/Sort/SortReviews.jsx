import { useReviewContext } from "../../context/Review/ReviewContext";
import SortButton from "./SortButton";

export default function SortReviews() {
  const { reviews, setReviews } = useReviewContext();

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Best", value: "best" },
    { label: "Controversial", value: "worst" },
    { label: "Replied to", value: "replies" },
  ];

  function sortMethod(sortValue) {
    return reviews.sort((a, b) => {
      switch (sortValue) {
        case "newest":
          return b.createdAt - a.createdAt;

        case "oldest":
          return a.createdAt - b.createdAt;

        case "best":
          return (
            b.likes.length - a.likes.length ||
            a.dislikes.length - b.dislikes.length ||
            b.createdAt - a.createdAt ||
            a.userId.localeCompare(b.userId)
          );

        case "worst":
          return (
            b.dislikes.length - a.dislikes.length ||
            a.likes.length - b.likes.length ||
            b.createdAt - a.createdAt ||
            a.userId.localeCompare(b.userId)
          );

        case "replies":
          return (
            b.replies.length - a.replies.length ||
            b.createdAt - a.createdAt ||
            a.userId.localeCompare(b.userId)
          );

        default:
          return 0;
      }
    });
  }

  return (
    <SortButton
      results={reviews}
      setResults={setReviews}
      sortOptions={sortOptions}
      sortMethod={sortMethod}
    />
  );
}
