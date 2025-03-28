import { Link } from "react-router-dom";
import MediaListCard from "./MediaListCard";

export default function MediaList({ mediaList }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {mediaList?.length > 0 &&
        mediaList.map((media) => {
          return (
            <Link key={media.id} to={media.link} className="w-48">
              <MediaListCard {...media} />
            </Link>
          );
        })}
    </div>
  );
}
