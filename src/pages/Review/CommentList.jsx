import CommentInput from "../../components/Inputs/CommentInput";
import CommentCard from "../../components/Cards/CommentCard";
import SortComments from "../../components/Sort/SortComments";
import { useAuthContext } from "../../context/Auth/AuthContext";

export default function CommentList({ comments, setComments, reviewId }) {
  const { globalUser } = useAuthContext();

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">
            {comments?.length || 0}{" "}
            {comments?.length === 1 ? "Comment" : "Comments"}
          </h2>
          {comments?.length > 0 && (
            <SortComments comments={comments} setComments={setComments} />
          )}
        </div>

        <div className="ml-2">
          {globalUser && <CommentInput reviewId={reviewId} />}
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
                    reviewId={reviewId}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
