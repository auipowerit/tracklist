import { useEffect, useState } from "react";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { useListContext } from "src/features/list/context/ListContext";
import { useInboxContext } from "src/features/inbox/context/InboxContext";
import "./list-buttons.scss";

export default function SaveButton({ list, user }) {
  const { globalUser } = useAuthContext();
  const { addNotification } = useInboxContext();
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

    // Send notification if not author and not already saved
    if (list.userId !== globalUser.uid && !isSaved) {
      await addNotification(
        list.userId,
        globalUser.uid,
        `${globalUser.username} saved your list:`,
        "",
        list.id,
        "list",
      );
    }
  }

  return (
    <button
      onClick={handleSave}
      className={`save-list-button ${isSaved ? "save-list-button--active" : ""} ${list.userId === globalUser?.uid ? "disabled" : ""}`}
    >
      <FontAwesomeIcon
        icon={faBookmark}
        className={isActive ? "fa-beat" : ""}
      />
      <p>{saves || 0}</p>
    </button>
  );
}
