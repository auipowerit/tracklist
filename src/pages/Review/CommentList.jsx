import { useEffect, useState } from "react";
import Loading from "src/components/Loading";
import CommentCard from "src/components/Cards/CommentCard";
import SortComments from "src/components/Sort/SortComments";
import CommentInput from "src/components/Inputs/CommentInput";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useCommentContext } from "src/context/Comment/CommentContext";

export default function CommentList({ review }) {
  const { globalUser } = useAuthContext();
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

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">
          {comments?.length || 0}{" "}
          {comments?.length === 1 ? "Comment" : "Comments"}
        </h2>
        <SortComments comments={comments} setComments={setComments} />
      </div>

      <div className="ml-2">
        {globalUser && (
          <CommentInput review={review} setComments={setComments} />
        )}
        {comments?.length === 0 ? (
          <p className="m-auto text-center text-3xl text-gray-400">
            No comments yet!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments?.map((comment) => {
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
        )}
      </div>
    </div>
  );
}
