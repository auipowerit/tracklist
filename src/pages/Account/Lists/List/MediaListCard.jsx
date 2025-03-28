export default function MediaListCard({ title, subtitle, image }) {
  return (
    <div>
      <img
        src={image}
        className="border-2 border-transparent transition-all hover:border-white"
      />
      <p></p>
      <p className="text-center font-bold text-wrap">{title}</p>
      <p className="text-center text-wrap text-gray-400">[{subtitle}]</p>
    </div>
  );
}
