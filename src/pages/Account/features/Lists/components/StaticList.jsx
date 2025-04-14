import { Link } from "react-router-dom";
import ListItemCard from "src/components/Cards/ListItemCard";

export default function StaticList({ items, list }) {
  return items.map((item, index) => (
    <div key={item.id}>
      <Link to={item.titleLink}>
        <ListItemCard
          title={item.title}
          subtitle={item.subtitle}
          image={item.image}
          index={list.isRanking && index + 1}
        />
      </Link>
    </div>
  ));
}
