

export default function AuthInput({ label, name, type, ...props }) {
  function handleChange(element) {
    element.target.classList.remove("invalid-field");
  }

  return (
    <div className="auth-input-container">
      <label htmlFor={name}>{label}</label>
      <input
        className="auth-input"
        name={name}
        type={type}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}
