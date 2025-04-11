import { Link } from "react-router-dom";
import MediaListCard from "src/components/Cards/MediaListCard";

export default function MediaList({ items, isRanking }) {
  return items.map((item, index) => (
    <Link
      key={item.id}
      to={item.titleLink}
      className="border-1 border-transparent hover:border-white"
    >
      <MediaListCard
        title={item.title}
        subtitle={item.subtitle}
        image={item.image}
        index={isRanking && index + 1}
      />
    </Link>
  ));
}
