import { Link } from "react-router-dom";
import ListItemCard from "src/features/list/components/cards/ListItemCard";

export default function StaticList({ items, list, orientation }) {
  return items.map((item, index) => (
    <Link to={item.titleLink} key={item.id}>
      <ListItemCard
        title={item.title}
        subtitle={item.subtitle}
        image={item.image}
        index={list.isRanking && index + 1}
        orientation={orientation}
      />
    </Link>
  ));
}
