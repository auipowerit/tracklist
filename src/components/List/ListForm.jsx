import { useState } from "react";
import NewList from "./NewList";
import AddToList from "./AddToList";

export default function ListForm({
  isModalOpen,
  setIsModalOpen,
  media,
  category,
}) {
  const [newList, setNewList] = useState(false);

  return newList ? (
    <NewList isModalOpen={isModalOpen} setNewList={setNewList} />
  ) : (
    <AddToList
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      media={media}
      category={category}
      setNewList={setNewList}
    />
  );
}
