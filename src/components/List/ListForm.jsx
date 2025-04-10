import { useState } from "react";
import CreateList from "./CreateList";
import AddList from "./AddList";

export default function ListForm(props) {
  const { isModalOpen, setIsModalOpen, media, category, list, isAdding } =
    props;

  const [newList, setNewList] = useState(false);

  if (isAdding) {
    return (
      <AddList
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        media={media}
        listId={list?.id}
        category={category}
      />
    );
  }

  if (!media || !category)
    return (
      <CreateList
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        list={list}
      />
    );

  return newList ? (
    <CreateList
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      setNewList={setNewList}
    />
  ) : (
    <AddList
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      mediaId={media.mediaId}
      category={category}
      setNewList={setNewList}
    />
  );
}
