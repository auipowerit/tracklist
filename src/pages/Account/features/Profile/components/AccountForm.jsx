import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

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
    <form
      onSubmit={handleSubmit}
      className="m-auto flex flex-col items-center justify-center gap-8 py-6 text-xl"
    >
      <FormHeader />
      <div className="flex gap-6">
        <FormImage globalUser={globalUser} />

        <div className="flex flex-col gap-4">
          <FormName name={name} setName={setName} />
          <FormBio bio={bio} setBio={setBio} />
        </div>
      </div>
      <FormButton />
    </form>
  );
}

function FormHeader() {
  return (
    <p className="w-full border-b-1 border-white pb-2 text-2xl font-bold">
      Edit Account
    </p>
  );
}

function FormImage({ globalUser }) {
  const { redirectToSpotifyAuth } = useSpotifyContext();

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={globalUser?.profileUrl} className="h-48 w-48 rounded-full" />

      <button
        type="button"
        onClick={redirectToSpotifyAuth}
        className="flex items-center justify-center gap-2 rounded-md border-2 border-white px-3 py-2 hover:text-gray-400"
      >
        <FaSpotify />
        <p>{globalUser?.spotifyUrl ? "Resync" : "Sync"}</p>
      </button>
    </div>
  );
}

function FormName({ name, setName }) {
  const NAME_LIMIT = 25;

  const color = name.length >= NAME_LIMIT ? "text-red-600" : "text-gray-400";

  function handleChange(e) {
    if (e.target.value.length > NAME_LIMIT) {
      setName(e.target.value.slice(0, NAME_LIMIT));
      return;
    }
    setName(e.target.value);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor="name">Display name</label>
        <p className={`text-sm ${color}`}>
          {name.length || 0}/{NAME_LIMIT}
        </p>
      </div>
      <input
        name="name"
        type="text"
        value={name}
        onChange={handleChange}
        className="border-1 border-white px-2 py-1"
      />
    </div>
  );
}

function FormBio({ bio, setBio }) {
  const BIO_LIMIT = 100;

  const color = bio.length >= BIO_LIMIT ? "text-red-600" : "text-gray-400";

  function handleChange(e) {
    if (e.target.value.length > BIO_LIMIT) {
      setBio(e.target.value.slice(0, BIO_LIMIT));
      return;
    }
    setBio(e.target.value);
  }

  return (
    <div className="flex h-full flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor="bio">Bio</label>
        <p className={`text-sm ${color}`}>
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
    <div className="flex items-center gap-4">
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2 hover:text-gray-400"
      >
        <FontAwesomeIcon icon={faCheck} />
        <p>Save</p>
      </button>
    </div>
  );
}
