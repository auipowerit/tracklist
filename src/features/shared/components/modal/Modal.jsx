import Button from "../buttons/Button";
import "./modal.scss";

export default function Modal({ children, isModalOpen, setIsModalOpen }) {
  function onClose() {
    setIsModalOpen(false);
    document.body.classList.remove("lock-scroll");
  }

  return (
    <div onClick={onClose} className="modal" aria-expanded={isModalOpen}>
      <div onClick={(e) => e.stopPropagation()} className="modal__container">
        <Button
          onClick={onClose}
          classes="modal__button"
          ariaLabel="close modal"
        >
          &times;
        </Button>

        {children}
      </div>
    </div>
  );
}
