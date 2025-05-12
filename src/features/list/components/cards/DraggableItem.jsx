import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListItemCard from "src/features/list/components/cards/ListItemCard";
import "./draggable-item.scss";

export default function DraggableItem(props) {
  const { item, index, handleDelete, list, orientation } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="draggable-item">
        <div
          {...listeners}
          className={`draggable-item__listener ${isDragging ? "draggable-item__listener--active" : ""}`}
        >
          <ListItemCard
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            index={list.isRanking && index + 1}
            orientation={orientation}
          />
        </div>

        <button
          type="button"
          onClick={() => handleDelete(item.id)}
          className="draggable-item__delete"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
}
