import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
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
          className="draggable-item__listener"
          aria-selected={isDragging}
        >
          <ListItemCard
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            index={list.isRanking && index + 1}
            orientation={orientation}
          />
        </div>

        <Button
          onClick={() => handleDelete(item.id)}
          classes="draggable-item__delete"
          ariaLabel="remove media from list"
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </div>
    </div>
  );
}
