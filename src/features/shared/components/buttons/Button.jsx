export default function Button({
  type = "button",
  onClick,
  classes = "",
  ariaSelected = false,
  ariaLabel = "",
  children,
}) {
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
