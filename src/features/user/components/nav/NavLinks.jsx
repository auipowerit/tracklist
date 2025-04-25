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
    <div className="account-page-nav-links-container">
      {children.map((child) => (
        <Link
          key={child.id}
          to={`/users/${username}/${child.id}`}
          className={`account-page-nav-link ${isActive(child.id) && "active"}`}
        >
          {child.title}
        </Link>
      ))}
    </div>
  );
}
