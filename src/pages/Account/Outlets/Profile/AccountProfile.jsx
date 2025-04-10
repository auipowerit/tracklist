import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Modal from "src/components/Modal";
import { formatDateMDYLong } from "src/utils/date";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faPen } from "@fortawesome/free-solid-svg-icons";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

import AccountForm from "./AccountForm";
import { Tooltip } from "react-tooltip";

export default function AccountProfile() {
  const { globalUser } = useOutletContext();

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
          globalUser.uid,
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
        {globalUser.spotifyUrl ? (
          <Link
            to={globalUser.spotifyUrl}
            target="_blank"
            data-tooltip-id="profile-tooltip"
            data-tooltip-content="Open Spotify Profile"
          >
            <img
              src={globalUser.profileUrl}
              className="h-36 w-36 rounded-full object-cover"
            />
            <Tooltip
              id="profile-tooltip"
              place="top"
              type="dark"
              effect="float"
            />
          </Link>
        ) : (
          <img
            src={globalUser.profileUrl}
            className="h-36 w-36 rounded-full object-cover"
          />
        )}

        <form className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{globalUser.displayname}</p>
            <p className="text-gray-400">@{globalUser.username}</p>
          </div>

          <p>{globalUser.bio}</p>

          <div className="flex items-center gap-1 text-gray-400">
            <FontAwesomeIcon icon={faCalendar} className="text-sm" />
            <p>Joined on {formatDateMDYLong(globalUser.createdAt.toDate())}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-gray-400">
                <span className="font-bold text-white">
                  {globalUser.followers.length}
                </span>{" "}
                followers
              </p>
              <p className="text-gray-400">
                <span className="font-bold text-white">
                  {globalUser.followers.length}
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
