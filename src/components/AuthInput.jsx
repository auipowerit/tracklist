export default function AuthInput({ label, name, type, ...props }) {
  return (
    <div className="flex justify-between gap-4">
      <label htmlFor={name}>{label}</label>
      <input
        className="ml-auto border-2 border-white px-2 py-1"
        name={name}
        type={type}
        {...props}
      />
    </div>
  );
}
