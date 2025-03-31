import CommentInput from "../../components/Inputs/CommentInput";
import CommentCard from "../../components/Cards/CommentCard";
import SortComments from "../../components/Sort/SortComments";
import { useAuthContext } from "../../context/Auth/AuthContext";
import { useEffect, useState } from "react";
import { useCommentContext } from "../../context/Comment/CommentContext";
import Loading from "../../components/Loading";

export default function CommentList({ review }) {
  const { globalUser } = useAuthContext();
  const { getCommentsByReviewId } = useCommentContext();

  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);

        const fetchedComments = await getCommentsByReviewId(review.id);
        setComments(fetchedComments);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    return fetchComments;
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {comments?.length || 0}{" "}
          {comments?.length === 1 ? "Comment" : "Comments"}
        </h2>
        {comments?.length > 0 && (
          <SortComments comments={comments} setComments={setComments} />
        )}
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
