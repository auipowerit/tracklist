export default function ListHeader({ name, tags }) {
  return (
    <div className="flex items-center justify-between align-middle">
      <p className="text-2xl text-white">{name}</p>
      <div className="flex gap-2">
        {tags.map((tag, index) => {
          return (
            <p key={index} className="rounded-sm bg-gray-600 p-2">
              {tag}
            </p>
          );
        })}
      </div>
    </div>
  );
}
