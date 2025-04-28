import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import "./account-form.scss";

export default function AccountForm({ isModalOpen, setIsModalOpen }) {
  const { globalUser, updateUserDetails } = useAuthContext();

  const [name, setName] = useState(globalUser?.displayname || "");
  const [bio, setBio] = useState(globalUser?.bio || "");

  useEffect(() => {
    handleModal();
    handleValues();
  }, [isModalOpen, globalUser]);

  function handleModal() {
    if (!isModalOpen) resetValues();
  }

  function handleValues() {
    if (globalUser) {
      setName(globalUser.displayname);
      setBio(globalUser.bio);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!globalUser || name === "" || bio === "") return;

    await updateUserDetails(globalUser.uid, name, bio);

    setIsModalOpen(false);
    window.location.reload();
    resetValues();
  }

  function resetValues() {
    setName("");
    setBio("");
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormHeader />
      <div className="form-content user-form-content">
        <FormImage globalUser={globalUser} />

        <div className="user-form-info">
          <FormName name={name} setName={setName} />
          <FormBio bio={bio} setBio={setBio} />
        </div>
      </div>
      <FormButton />
    </form>
  );
}

function FormHeader() {
  return <p className="form-header">Edit Account</p>;
}

function FormImage({ globalUser }) {
  const { redirectToSpotifyAuth } = useSpotifyContext();

  return (
    <div className="user-form-profile-container">
      <img src={globalUser?.profileUrl} />

      <button
        type="button"
        onClick={() => redirectToSpotifyAuth(false)}
        className="basic-button"
      >
        <FaSpotify />
        <p>{globalUser?.spotifyUrl ? "Resync" : "Sync"}</p>
      </button>
    </div>
  );
}

function FormName({ name, setName }) {
  const NAME_LIMIT = 25;

  const color = name.length >= NAME_LIMIT ? "red" : "gray";

  function handleChange(e) {
    if (e.target.value.length > NAME_LIMIT) {
      setName(e.target.value.slice(0, NAME_LIMIT));
      return;
    }
    setName(e.target.value);
  }

  return (
    <div className="user-form-input-container">
      <div className="user-form-label">
        <label htmlFor="name">Display name</label>
        <p style={{ color: color }}>
          {name.length || 0}/{NAME_LIMIT}
        </p>
      </div>
      <input
        name="name"
        type="text"
        value={name}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
}

function FormBio({ bio, setBio }) {
  const BIO_LIMIT = 100;

  const color = bio.length >= BIO_LIMIT ? "red" : "gray";

  function handleChange(e) {
    if (e.target.value.length > BIO_LIMIT) {
      setBio(e.target.value.slice(0, BIO_LIMIT));
      return;
    }
    setBio(e.target.value);
  }

  return (
    <div className="form-textarea-container">
      <div className="user-form-label">
        <label htmlFor="bio">Bio</label>
        <p style={{ color: color }}>
          {bio.length || 0}/{BIO_LIMIT}
        </p>
      </div>
      <textarea
        name="bio"
        type="text"
        value={bio}
        onChange={handleChange}
        className="h-full border-1 border-white px-2 py-1"
      />
    </div>
  );
}

function FormButton() {
  return (
    <button type="submit" className="form-submit-button">
      <FontAwesomeIcon icon={faCheck} />
      <p>Save</p>
    </button>
  );
}
