export default function AuthInput({ label, name, type, ...props }) {
  return (
    <div className="auth-input-container">
      <label htmlFor={name}>{label}</label>
      <input className="auth-input" name={name} type={type} {...props} />
    </div>
  );
}
