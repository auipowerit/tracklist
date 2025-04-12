import { useNavigate } from "react-router-dom";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/context/Auth/AuthContext";

export default function LogoutButton() {
  const navigate = useNavigate();

  const { logout } = useAuthContext();

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
