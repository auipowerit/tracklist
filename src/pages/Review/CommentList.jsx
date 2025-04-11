import { useEffect, useState } from "react";
import Loading from "src/components/Loading";
import CommentCard from "./components/CommentCard";
import SortComments from "src/components/Sort/SortComments";
import CommentInput from "src/components/Inputs/CommentInput";
import { useCommentContext } from "src/context/Comment/CommentContext";

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
    <div className="flex flex-col gap-6 pb-12">
      <Header comments={comments} setComments={setComments} />

      <div className="ml-2">
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
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-bold">
        {comments?.length || 0}{" "}
        {comments?.length === 1 ? "Comment" : "Comments"}
      </h2>
      <SortComments comments={comments} setComments={setComments} />
    </div>
  );
}

function Comments({ comments, setComments, review }) {
  return (
    <div>
      {comments?.length > 0 ? (
        <div className="flex flex-col gap-4">
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
      ) : (
        <p className="m-auto text-center text-3xl text-gray-400">
          No comments yet!
        </p>
      )}
    </div>
  );
}
