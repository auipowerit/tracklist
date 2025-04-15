import { useEffect, useState } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useListContext } from "src/context/List/ListContext";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SaveButton({ list, user }) {
  const { globalUser } = useAuthContext();
  const { saveList } = useListContext();

  const [saves, setSaves] = useState(list.saves.length);
  const [isSaved, setIsSaved] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!globalUser) return;

    setIsSaved(list.saves.includes(globalUser?.uid));
  }, [globalUser]);

  async function handleSave() {
    if (!globalUser || user.uid === globalUser.uid) return;

    if (!isSaved) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 500);
    }

    setSaves(isSaved ? saves - 1 : saves + 1);
    setIsSaved(!isSaved);
    await saveList(list.id, globalUser.uid);
  }

  return (
    <button
      onClick={handleSave}
      className={`flex w-8 items-center gap-2 hover:text-green-500 ${isSaved && "text-green-500"}`}
    >
      <FontAwesomeIcon icon={faBookmark} className={isActive && "fa-beat"} />
      <p>{saves || 0}</p>
    </button>
  );
}
