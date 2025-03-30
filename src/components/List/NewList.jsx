import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import FormInput from "../Inputs/FormInput";
import { useAuthContext } from "../../context/Auth/AuthContext";

export default function NewList({ isModalOpen, setIsModalOpen, setNewList }) {
  const { globalUser, checkIfListExists, createNewMediaList } =
    useAuthContext();

  const characterLimit = 150;

  const [tags, setTags] = useState([]);

  const nameRef = useRef(null);
  const tagsRef = useRef(null);
  const rankingRef = useRef(null);
  const visibilityRef = useRef(null);
  const [description, setDescription] = useState("");

  function addTag(e) {
    if (e.key !== "," || tagsRef.current.value === "") return;

    const newTag = tagsRef.current.value.slice(0, -1);

    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }

    tagsRef.current.value = "";
  }

  function removeTag(tag) {
    setTags(tags.filter((item) => item !== tag));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const listData = getValues();
    if (!listData) return;

    const listExists = await checkIfListExists(listData.name, globalUser.uid);
    if (listExists) return;

    await createNewMediaList(listData, globalUser.uid);

    if (!setNewList) {
      setIsModalOpen(false);
      return;
    }

    setNewList(false);
    resetValues();
  }

  function getValues() {
    const name = nameRef.current.value;
    const isRanking = rankingRef.current.checked;
    const isPrivate = visibilityRef.current.checked;

    if (name === "" || description === "" || !globalUser) {
      return;
    }

    const listData = {
      name,
      tags: [...new Set(tags)], // Remove duplicates
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
      <p className="w-full border-b-1 border-white pb-2 text-2xl font-bold">
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
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <FormInput
                name="tags"
                type="text"
                ref={tagsRef}
                onKeyUp={addTag}
                classes="border-1 border-white"
                label="Tags (comma separated)"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-sm bg-gray-700 px-2 py-1"
                  >
                    <p>{tag}</p>
                    <button type="button" onClick={() => removeTag(tag)}>
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FormInput name="ranking" type="checkbox" ref={rankingRef} />
              <label htmlFor="ranking">Ranking</label>
            </div>
            <div className="flex items-center gap-2">
              <FormInput
                name="visibility"
                type="checkbox"
                ref={visibilityRef}
              />
              <label htmlFor="visibility">Private</label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="description">Description</label>
            <p
              className={`text-sm ${description.length >= characterLimit ? "text-red-600" : "text-gray-400"}`}
            >
              {description.length || 0}/{characterLimit}
            </p>
          </div>

          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              if (e.target.value.length > characterLimit) {
                setDescription(e.target.value.slice(0, characterLimit));
                return;
              }
              setDescription(e.target.value);
            }}
            className="h-full border-1 border-white px-2 py-1 outline-none"
          />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        {setNewList && (
          <button
            type="button"
            onClick={() => setNewList(false)}
            className="flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <p>Back</p>
          </button>
        )}
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
