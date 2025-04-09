import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Modal from "src/components/Modal";
import { formatDateMDYLong } from "src/utils/date";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faPen } from "@fortawesome/free-solid-svg-icons";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

import AccountForm from "./AccountForm";

export default function AccountProfile() {
  const { globalData } = useOutletContext();

  const params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  const { updateSpotifyInfo } = useAuthContext();
  const { getAuthAccessToken, getSpotifyUser } = useSpotifyContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("profile")) {
        navigate("/account/profile");
        return;
      }

      const fetchedCode = params.get("code") || null;
      if (!fetchedCode) return;

      const accessToken = await getAuthAccessToken(fetchedCode);
      if (!accessToken) return;

      const profile = await getSpotifyUser(accessToken);
      if (!profile) return;

      if (profile) {
        localStorage.setItem("profile", JSON.stringify(profile));

        await updateSpotifyInfo(
          globalData.id,
          profile?.images?.[0].url,
          profile?.external_urls?.spotify,
        );

        navigate("/account/profile");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex w-full items-start justify-between">
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <AccountForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>

      <div className="flex items-center gap-4">
        <Link
          to={globalData.spotifyUrl || "#"}
          target={globalData.spotifyUrl ? "_blank" : "_self"}
        >
          <img
            src={globalData.profileUrl}
            className="h-36 w-36 rounded-full object-cover"
          />
        </Link>

        <form className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{globalData.displayname}</p>
            <p className="text-gray-400">@{globalData.username}</p>
          </div>

          <p>{globalData.bio}</p>

          <div className="flex items-center gap-1 text-gray-400">
            <FontAwesomeIcon icon={faCalendar} className="text-sm" />
            <p>Joined on {formatDateMDYLong(globalData.createdAt.toDate())}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-gray-400">
                <span className="font-bold text-white">
                  {globalData.followers.length}
                </span>{" "}
                followers
              </p>
              <p className="text-gray-400">
                <span className="font-bold text-white">
                  {globalData.followers.length}
                </span>{" "}
                following
              </p>
            </div>
          </div>
        </form>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 border-2 border-white px-3 py-1 text-lg hover:text-gray-400"
      >
        <FontAwesomeIcon icon={faPen} />
        <p>Edit</p>
      </button>
    </div>
  );
}
