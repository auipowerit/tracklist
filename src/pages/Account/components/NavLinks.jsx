import { Link, useLocation } from "react-router-dom";

export default function NavLinks() {
  const children = [
    { id: "reviews", title: "Reviews" },
    { id: "lists", title: "Lists" },
    { id: "likes", title: "Likes" },
    { id: "friends", title: "Friends" },
  ];

  const location = useLocation();

  const isActive = (page) => {
    return location.pathname.startsWith("/account/" + page);
  };

  return (
    <div className="flex items-center gap-4">
      {children.map((child) => (
        <Link
          key={child.id}
          to={child.id}
          className={`flex items-center gap-2 hover:text-white ${isActive(child.id) && "text-white"}`}
        >
          {child.title}
        </Link>
      ))}
    </div>
  );
}
