import { useEffect, useState } from "react";
import { WAITING_MESSAGES } from "src/data/const";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles/loading.scss";

export default function Loading() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const message =
      WAITING_MESSAGES[Math.floor(Math.random() * WAITING_MESSAGES.length)];
    setMessage(message);
  }, []);

  return (
    <div className="loading">
      <div className="loading__icons">
        <FontAwesomeIcon icon={faMusic} className="loading__icon" />
        <FontAwesomeIcon icon={faMusic} className="loading__icon" />
        <FontAwesomeIcon icon={faMusic} className="loading__icon" />
        <FontAwesomeIcon icon={faMusic} className="loading__icon" />
      </div>
      <p className="loading__message">"{message}..."</p>
    </div>
  );
}
