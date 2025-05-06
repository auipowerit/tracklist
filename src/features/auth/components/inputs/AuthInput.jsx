export default function AuthInput({ label, name, type, ...props }) {
  function handleChange(e) {
    e.target.classList.remove("form__input--invalid");
  }

  return (
    <div className="auth__input--wrapper">
      <label htmlFor={name} className="auth__label">
        {label}
      </label>
      <input
        name={name}
        type={type}
        onChange={handleChange}
        {...props}
        className="auth__input"
      />
    </div>
  );
}
