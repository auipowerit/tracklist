import { useState } from "react";
import AddToList from "./AddToList";
import CreateList from "./CreateList";

export default function ListForm(props) {
  const { isModalOpen, setIsModalOpen, media, category, list } = props;

  const [newList, setNewList] = useState(false);

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
      media={media}
      category={category}
      setNewList={setNewList}
    />
  );
}
