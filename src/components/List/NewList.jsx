import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "../../context/Auth/AuthContext";
import FormInput from "../Inputs/FormInput";

export default function NewList({ isModalOpen, setNewList }) {
  const { globalUser, checkIfListExists, createNewMediaList } =
    useAuthContext();

  const nameRef = useRef(null);
  const tagsRef = useRef(null);
  const rankingRef = useRef(null);
  const descrRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const listData = getValues();
    if (!listData) return;

    const listExists = await checkIfListExists(listData.name, globalUser.uid);
    if (listExists) return;

    await createNewMediaList(listData, globalUser.uid);

    setNewList(false);
    resetValues();
  }

  function getValues() {
    const name = nameRef.current.value;
    const tags = tagsRef.current.value;
    const isRanking = rankingRef.current.checked;
    const descr = descrRef.current.value;

    if (name === "" || descr === "" || !globalUser) {
      return;
    }

    const tagArray = tags === "" ? [] : tags.replace(/, /g, ",").split(",");

    const listData = {
      name,
      tags: tagArray,
      isRanking,
      descr,
      media: [],
    };

    return listData;
  }

  function resetValues() {
    nameRef.current.value = "";
    tagsRef.current.value = "";
    rankingRef.current.checked = false;
    descrRef.current.value = "";
    setNewList(false);
  }

  useEffect(() => {
    if (!isModalOpen) resetValues();
  }, [isModalOpen]);

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex flex-col items-center justify-center gap-8 py-6 text-xl"
    >
      <p className="w-full border-b-1 border-white pb-2 text-2xl text-gray-400">
        New List
      </p>
      <div className="flex h-full justify-center gap-6">
        <div className="flex h-full flex-col gap-8">
          <div className="flex flex-col gap-1">
            <FormInput
              name="name"
              type="text"
              ref={nameRef}
              classes="border-1 border-white"
              label="Name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FormInput
              name="tags"
              type="text"
              ref={tagsRef}
              classes="border-1 border-white"
              label="Tags (Comma Seperated)"
            />
          </div>
          <div className="flex items-center gap-2">
            <FormInput type="checkbox" ref={rankingRef} />
            <p>Ranking</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p>Description</p>
          <textarea
            ref={descrRef}
            className="h-full border-1 border-white px-2 py-1"
          />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setNewList(false)}
          className="flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <p>Back</p>
        </button>
        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-green-700 px-4 py-2"
        >
          <p>Create</p>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </form>
  );
}
