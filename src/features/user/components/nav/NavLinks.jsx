import { Link, useLocation } from "react-router-dom";

export default function NavLinks({ username }) {
  const children = [
    { id: "reviews", title: "Reviews" },
    { id: "lists", title: "Lists" },
    { id: "likes", title: "Likes" },
    { id: "friends", title: "Friends" },
  ];

  const location = useLocation();

  const isActive = (page) => {
    return location.pathname.startsWith(`/users/${username}/${page}`);
  };

  return (
    <div className="account__nav-links">
      {children.map((child) => (
        <Link
          key={child.id}
          to={`/users/${username}/${child.id}`}
          className={`account__nav-link ${isActive(child.id) && "account__nav-link--active"}`}
        >
          {child.title}
        </Link>
      ))}
    </div>
  );
}
