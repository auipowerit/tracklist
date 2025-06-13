import { closestCenter, DndContext } from "@dnd-kit/core";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useListContext } from "src/features/list/context/ListContext";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import DraggableItem from "src/features/list/components/cards/DraggableItem";

export default function DraggableList({ items, setItems, list, orientation }) {
  const { globalUser } = useAuthContext();
  const { reorderListItems, deleteListItem } = useListContext();

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(items, oldIndex, newIndex);
      reorderListItems(list.id, newOrder, globalUser.uid);

      return newOrder;
    });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    await deleteListItem(itemId, list.id, globalUser.uid);

    setItems(
      items.filter((item) => {
        return item.id !== itemId;
      }),
    );
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {items.map((item, index) => (
          <div key={item.id}>
            <DraggableItem
              item={item}
              index={index}
              handleDelete={handleDelete}
              list={list}
              orientation={orientation}
            />
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
}
