import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ListItemCard from "src/components/Cards/ListItemCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DraggableItem({
  item,
  index,
  handleDelete,
  list,
  orientation,
}) {
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex flex-col justify-center gap-1"
    >
      <div className="relative">
        <div
          {...listeners}
          className={`cursor-grab ${!isDragging && "opacity-50"}`}
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
          className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-700/80 p-2 hover:opacity-75"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
}
