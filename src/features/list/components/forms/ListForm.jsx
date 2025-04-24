import { useState } from "react";
import CreateList from "./CreateList";
import AddToList from "./AddToList";

export default function ListForm(props) {
  const { isModalOpen, setIsModalOpen, media, category, list, isAdding } =
    props;

  const [newList, setNewList] = useState(false);

  if (isAdding) {
    return newList ? (
      <CreateList
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setNewList={setNewList}
      />
    ) : (
      <AddToList
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        media={media}
        listId={list?.id}
        category={category}
        setNewList={setNewList}
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
    <AddToList
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      mediaId={media.mediaId}
      category={category}
      setNewList={setNewList}
    />
  );
}
