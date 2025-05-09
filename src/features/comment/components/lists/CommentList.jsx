import { useEffect, useState } from "react";
import Loading from "src/features/shared/components/Loading";
import SortComments from "src/features/sort/components/SortComments";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import CommentInput from "../inputs/CommentInput";
import CommentCard from "../cards/CommentCard";
import "./comment-list.scss";

export default function CommentList({ review }) {
  const { getReviewComments } = useCommentContext();

  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);

        const fetchedComments = await getReviewComments(review.id);
        setComments(fetchedComments);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="comments">
      <Header review={review} comments={comments} setComments={setComments} />

      <Comments comments={comments} setComments={setComments} review={review} />
    </div>
  );
}

function Header({ review, comments, setComments }) {
  function sortMethod(sortValue) {
    return comments.sort((a, b) => {
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

        default:
          return 0;
      }
    });
  }

  return (
    <div className="comments__header">
      <div className="comments__title-container">
        <h2 className="comments__title">
          {comments?.length || 0}&nbsp;
          {comments?.length === 1 ? "Comment" : "Comments"}
        </h2>

        <SortComments
          comments={comments}
          setComments={setComments}
          sortMethod={sortMethod}
        />
      </div>

      <SortSelect setComments={setComments} sortMethod={sortMethod} />

      <CommentInput review={review} setComments={setComments} />
    </div>
  );
}

function Comments({ comments, setComments, review }) {
  if (!comments || comments?.length === 0) {
    return <p className="empty__message">No comments yet!</p>;
  }

  return (
    <div className="comments__list">
      {comments.map((comment) => {
        return (
          <CommentCard
            key={comment.id}
            comment={comment}
            review={review}
            comments={comments}
            setComments={setComments}
          />
        );
      })}
    </div>
  );
}

function SortSelect({ setComments, sortMethod }) {
  const [sortValue, setSortValue] = useState("newest");

  useEffect(() => {
    const sortedComments = sortMethod(sortValue);
    setComments([...sortedComments]);
  }, [sortValue]);

  return (
    <div className="comments__tabs">
      <button
        type="button"
        onClick={() => setSortValue("newest")}
        className={`comments__tab ${sortValue === "newest" && "comments__tab--active"}`}
      >
        Newest
      </button>
      <button
        type="button"
        onClick={() => setSortValue("oldest")}
        className={`comments__tab ${sortValue === "oldest" && "comments__tab--active"}`}
      >
        Oldest
      </button>
      <button
        type="button"
        onClick={() => setSortValue("best")}
        className={`comments__tab ${sortValue === "best" && "comments__tab--active"}`}
      >
        Best
      </button>
      <button
        type="button"
        onClick={() => setSortValue("worst")}
        className={`comments__tab ${sortValue === "worst" && "comments__tab--active"}`}
      >
        Worst
      </button>
    </div>
  );
}
