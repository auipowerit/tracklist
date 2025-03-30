export default function FormInput(props) {
  const { name, type, ref, onKeyUp, placeholder, classes, label } = props;

  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        ref={ref}
        placeholder={placeholder}
        onKeyUp={onKeyUp}
        className={`px-2 py-1 outline-hidden ${classes}`}
      />
    </>
  );
}
