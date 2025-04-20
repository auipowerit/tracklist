import { useEffect, useRef } from "react";
import { FaSpotify } from "react-icons/fa";
import AuthInput from "src/components/Inputs/AuthInput";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function Signup({ setIsRegistration }) {
  const { signup, usernameAvailable } = useAuthContext();
  const { redirectToSpotifyAuth, getAuthAccessToken, getSpotifyUser } =
    useSpotifyContext();

  const params = new URLSearchParams(window.location.search);

  const formRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("profile")) {
        localStorage.removeItem("profile");
      }

      const profile = await handleProfile();
      if (profile) {
        await handleLogin(profile);
      }
    };

    fetchData();
  }, []);

  async function handleProfile() {
    const fetchedCode = params.get("code") || null;
    if (!fetchedCode) return;

    const accessToken = await getAuthAccessToken(fetchedCode, true);
    if (!accessToken) return;

    const profile = await getSpotifyUser(accessToken);

    return profile || null;
  }

  async function handleLogin(profile) {
    await signup(
      profile.email,
      "password",
      profile.display_name,
      profile.id,
      profile.images?.[0].url,
      profile.external_urls?.spotify,
    );

    localStorage.removeItem("isRegistration");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const email = formData.get("email");
    const password = formData.get("password");
    const displayname = formData.get("displayname");
    const username = formData.get("username");

    if (!(await usernameAvailable(username))) {
      console.log("Username taken!");
      return;
    }

    if (await signup(email, password, displayname, username)) {
      resetForm();
    } else {
      console.log("Failed to signup.");
    }
  }

  function resetForm() {
    setIsRegistration(false);
    formRef.current?.reset();
    localStorage.removeItem("isRegistration");
  }

  return (
    <div className="flex flex-col items-center justify-evenly gap-6 p-4 align-middle text-2xl">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <AuthInput label="Display Name" name="displayname" type="text" />
        <AuthInput label="Username" name="username" type="text" />
        <AuthInput label="Email Address" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <button
          type="submit"
          className="m-auto self-start rounded-md bg-green-700 px-5 py-2"
        >
          Submit
        </button>
      </form>

      <button
        type="button"
        onClick={() => redirectToSpotifyAuth(true)}
        className="flex items-center gap-2 border-1 border-white px-4 py-2 hover:text-green-500"
      >
        <FaSpotify />
        <p>Signup</p>
      </button>

      <button
        onClick={() => setIsRegistration(false)}
        className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-green-700"
      >
        <p>Sign in</p>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
}
