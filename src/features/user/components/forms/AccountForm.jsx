import { useEffect, useState } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "src/features/auth/context/AuthContext";
import { ACCOUNT_BIO_LIMIT, ACCOUNT_NAME_LIMIT } from "src/data/const";
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

  async function handleSubmit(e) {
    e.preventDefault();

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
        <FontAwesomeIcon icon={faSpotify} />
        <p>{globalUser?.spotifyUrl ? "Resync" : "Sync"}</p>
      </button>
    </div>
  );
}

function FormName({ name, setName }) {
  const color = name.length >= ACCOUNT_NAME_LIMIT ? "red" : "gray";

  function handleChange(e) {
    if (e.target.value.length > ACCOUNT_NAME_LIMIT) {
      setName(e.target.value.slice(0, ACCOUNT_NAME_LIMIT));
      return;
    }
    setName(e.target.value);
  }

  return (
    <div className="user-form-input-container">
      <div className="user-form-label">
        <label htmlFor="name">Display name</label>
        <p style={{ color: color }}>
          {name.length || 0}/{ACCOUNT_NAME_LIMIT}
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
  const color = bio.length >= ACCOUNT_BIO_LIMIT ? "red" : "gray";

  function handleChange(e) {
    if (e.target.value.length > ACCOUNT_BIO_LIMIT) {
      setBio(e.target.value.slice(0, ACCOUNT_BIO_LIMIT));
      return;
    }
    setBio(e.target.value);
  }

  return (
    <div className="form-textarea-container">
      <div className="user-form-label">
        <label htmlFor="bio">Bio</label>
        <p style={{ color: color }}>
          {bio.length || 0}/{ACCOUNT_BIO_LIMIT}
        </p>
      </div>
      <textarea
        name="bio"
        type="text"
        value={bio}
        onChange={handleChange}
        className="border-1 h-full border-white px-2 py-1"
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
