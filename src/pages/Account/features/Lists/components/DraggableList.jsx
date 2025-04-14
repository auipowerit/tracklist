import { closestCenter, DndContext } from "@dnd-kit/core";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useListContext } from "src/context/List/ListContext";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import DraggableItem from "./DraggableItem";

export default function DraggableList({ items, setItems, list }) {
  const { globalUser } = useAuthContext();
  const { reorderListItems, deleteListItem } = useListContext();

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id === over.id) return;

    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });

    await reorderList();
  }

  async function reorderList() {
    const newOrder = items.map((item) => {
      return {
        category: item.category,
        id: item.id,
      };
    });

    await reorderListItems(list.id, newOrder, globalUser.uid);
  }

  async function handleDelete(itemId) {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    await deleteListItem(itemId, list.id, globalUser.uid);

    setItems(
      items.filter((item) => {
        return item.id !== itemId;
      }),
    );
  }

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
            />
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
}
