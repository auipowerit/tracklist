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

  if (!media || !category)
    return (
      <NewList isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    );

  return newList ? (
    <NewList
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      setNewList={setNewList}
    />
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
