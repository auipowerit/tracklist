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
    <div className="comments-container">
      <Header comments={comments} setComments={setComments} />

      <div>
        <CommentInput review={review} setComments={setComments} />
        <Comments
          comments={comments}
          setComments={setComments}
          review={review}
        />
      </div>
    </div>
  );
}

function Header({ comments, setComments }) {
  return (
    <div className="comments-header-container">
      <h2 className="comments-header">
        {comments?.length || 0}&nbsp;
        {comments?.length === 1 ? "Comment" : "Comments"}
      </h2>
      <SortComments comments={comments} setComments={setComments} />
    </div>
  );
}

function Comments({ comments, setComments, review }) {
  if (!comments || comments?.length === 0) {
    return <p className="empty__message">No comments yet!</p>;
  }

  return (
    <div className="comments-list">
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
