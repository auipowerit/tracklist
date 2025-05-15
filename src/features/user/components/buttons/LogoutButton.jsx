import { useNavigate } from "react-router-dom";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "src/features/shared/components/buttons/Button";
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
    <Button
      onClick={handleLogout}
      classes="logout-button"
      ariaLabel="logout of account"
    >
      <FontAwesomeIcon icon={faSignOut} />
    </Button>
  );
}
