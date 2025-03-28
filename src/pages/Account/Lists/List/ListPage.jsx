import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { faArrowLeft, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MediaList from "./MediaList";
import ListHeader from "./ListHeader";
import Loading from "../../../../components/Loading";
import { useAuthContext } from "../../../../context/Auth/AuthContext";
import { useSpotifyContext } from "../../../../context/Spotify/SpotifyContext";

export default function ListPage() {
  const defaultImg = "/images/default-img.jpg";

  const { globalUser, getUserById, getUserListById } = useAuthContext();
  const { getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState(null);
  const [user, setUser] = useState("");
  const [mediaList, setMediaList] = useState({
    link: "",
    image: defaultImg,
  });

  const params = useParams();
  const listId = params?.listId;

  useEffect(() => {
    if (!globalUser || !listId) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const fetchedUser = await getUserById(globalUser.uid);
        setUser(fetchedUser);

        const fetchedList = await getUserListById(listId, globalUser.uid);
        setList(fetchedList);

        const mediaData = await Promise.all(
          fetchedList.media.map(async (media) => {
            const fetchedMedia = await getMediaById(media.id, media.category);
            const artist = fetchedMedia.artists?.[0] || fetchedMedia || {};
            const artistURL = `/artists/${artist?.id}`;

            return {
              id: fetchedMedia.id,
              title: fetchedMedia.name,
              subtitle: fetchedMedia.type,
              link:
                fetchedMedia.type === "artist"
                  ? artistURL
                  : fetchedMedia.type === "album"
                    ? `${artistURL}/albums/${fetchedMedia.id}`
                    : `${artistURL}/albums/${fetchedMedia.album?.id}/tracks/${fetchedMedia.id}`,
              image:
                fetchedMedia.images?.[0]?.url ||
                fetchedMedia.album?.images?.[0]?.url ||
                defaultImg,
            };
          }),
        );

        setMediaList(mediaData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [globalUser, listId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="m-auto flex w-fit flex-col gap-6 p-8">
      <Link
        to={"/account/lists"}
        className="flex w-fit items-center gap-2 rounded-sm bg-green-700 p-2 hover:text-gray-400"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <p>Back to Lists</p>
      </Link>
      {list && (
        <div className="flex w-fit flex-col gap-8">
          <ListHeader user={user} name={list.name} tags={list.tags} />
          <MediaList mediaList={mediaList} />
        </div>
      )}
    </div>
  );
}
