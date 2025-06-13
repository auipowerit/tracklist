export default function Button(props) {
  const {
    type = "button",
    onClick,
    classes = "",
    ariaSelected = false,
    ariaLabel = "",
    children,
  } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      aria-selected={ariaSelected}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
