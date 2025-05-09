import "./modal.scss";

export default function Modal({ children, isModalOpen, setIsModalOpen }) {
  function onClose() {
    setIsModalOpen(false);
    document.body.classList.remove("lock-scroll");
  }

  return (
    <div className={`modal ${isModalOpen && "modal--active"}`} onClick={onClose}>
      <div
        className={`modal__container ${isModalOpen && "modal__container--active"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="modal__button">
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}
