import { Link } from "react-router-dom";
import MediaListCard from "./MediaListCard";

export default function MediaList({ mediaList, isRanking }) {
  return (
    <div className="grid grid-cols-4">
      {mediaList?.length > 0 &&
        mediaList.map((media, index) => {
          return (
            <Link key={media.id} to={media.link} className="w-48">
              <MediaListCard
                title={media.title}
                subtitle={media.subtitle}
                image={media.image}
                index={isRanking && index + 1}
              />
            </Link>
          );
        })}
    </div>
  );
}
