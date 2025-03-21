export default function AuthInput({ label, name, type, ...props }) {
  return (
    <div className="flex justify-between gap-4">
      <label htmlFor={name}>{label}</label>
      <input
        className="ml-auto border-2 border-white"
        name={name}
        type={type}
        {...props}
      />
    </div>
  );
}
