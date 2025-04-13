import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { faGripLines, faXmark } from "@fortawesome/free-solid-svg-icons";
import MediaListCard from "src/components/Cards/MediaListCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function DraggableItem({ item, index, handleDelete, list }) {
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex flex-col justify-center gap-1"
    >
      <div className={`relative ${!isDragging && "opacity-50"}`}>
        <div {...listeners} className="cursor-grab">
          <MediaListCard
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            index={list.isRanking && index + 1}
          />
        </div>

        <button
          type="button"
          onClick={() => handleDelete(item.id)}
          className="absolute top-0 right-0 flex h-7 w-7 items-center justify-center bg-red-800 p-2 opacity-75 hover:opacity-100"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
}
