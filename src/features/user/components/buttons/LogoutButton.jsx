import { useNavigate } from "react-router-dom";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import "./user-buttons.scss";

export default function LogoutButton() {
  const navigate = useNavigate();

  const { logout } = useAuthContext();

  async function handleLogout() {
    await logout();
    navigate("/authenticate", { replace: true });
  }

  return (
    <button onClick={handleLogout} className="logout-btn">
      <FontAwesomeIcon icon={faSignOut} />
    </button>
  );
}
