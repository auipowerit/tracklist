import Button from "../buttons/Button";
import "./modal.scss";

export default function Modal({ children, isModalOpen, setIsModalOpen }) {
  const handleClose = () => {
    setIsModalOpen(false);
    document.body.classList.remove("lock-scroll");
  };

  return (
    <div onClick={handleClose} className="modal" aria-expanded={isModalOpen}>
      <div onClick={(e) => e.stopPropagation()} className="modal__container">
        <Button
          onClick={handleClose}
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
