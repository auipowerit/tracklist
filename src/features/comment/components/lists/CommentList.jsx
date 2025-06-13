import { useEffect, useState } from "react";
import Button from "src/features/shared/components/buttons/Button";
import SortComments from "src/features/sort/components/SortComments";
import { useCommentContext } from "src/features/comment/context/CommentContext";
import AddComment from "../forms/AddComment";
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
    return <section className="comments"></section>;
  }

  return (
    <section className="comments">
      <Header review={review} comments={comments} setComments={setComments} />
      <Comments comments={comments} setComments={setComments} review={review} />
    </section>
  );
}

function Header({ review, comments, setComments }) {
  function sortMethod(sortValue) {
    if (!comments) {
      return [];
    }

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

      <AddComment review={review} setComments={setComments} />
    </div>
  );
}

function Comments({ comments, setComments, review }) {
  if (!comments || comments?.length === 0) {
    return <p className="empty__message">No comments yet!</p>;
  }

  return (
    <div className="comments__list">
      {comments
        .filter((comment) => comment.replyingTo === "")
        .map((comment) => {
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
      <Button
        onClick={() => setSortValue("newest")}
        classes="comments__tab"
        ariaSelected={sortValue === "newest"}
      >
        Newest
      </Button>
      <Button
        onClick={() => setSortValue("oldest")}
        classes="comments__tab"
        ariaSelected={sortValue === "oldest"}
      >
        Oldest
      </Button>
      <Button
        onClick={() => setSortValue("best")}
        classes="comments__tab"
        ariaSelected={sortValue === "best"}
      >
        Best
      </Button>
      <Button
        onClick={() => setSortValue("worst")}
        classes="comments__tab"
        ariaSelected={sortValue === "worst"}
      >
        Worst
      </Button>
    </div>
  );
}
