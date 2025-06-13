import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Button from "src/features/shared/components/buttons/Button";
import { useAuthContext } from "../../context/AuthContext";

export default function GoogleLoginButton({ setError }) {
  const { loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (await loginWithGoogle(setError)) {
      navigate("/");
    }
  };

  return (
    <Button
      onClick={handleClick}
      classes="auth__google"
      ariaLabel="google login"
    >
      <FontAwesomeIcon icon={faGoogle} className="auth__google--icon" />
      <p>Log in with Google</p>
    </Button>
  );
}
