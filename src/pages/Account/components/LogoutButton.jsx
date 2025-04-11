import { useNavigate } from "react-router-dom";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LogoutButton() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/authenticate", { replace: true });
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 hover:text-white"
    >
      <FontAwesomeIcon icon={faSignOut} />
    </button>
  );
}
