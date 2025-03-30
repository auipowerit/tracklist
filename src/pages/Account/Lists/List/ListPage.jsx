import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaList from "./MediaList";
import ListHeader from "./ListHeader";
import Loading from "../../../../components/Loading";
import { useAuthContext } from "../../../../context/Auth/AuthContext";
import { useSpotifyContext } from "../../../../context/Spotify/SpotifyContext";

export default function ListPage() {
  const { globalUser, getUserById, getUserListById } = useAuthContext();
  const { defaultImg, getMediaById } = useSpotifyContext();

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
              subtitle:
                fetchedMedia.type === "track" ? "song" : fetchedMedia.type,
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
    <div className="m-auto mt-6 flex h-full w-3/5 flex-col gap-4">
      <ListHeader username={user.username} name={list.name} tags={list.tags} />
      <div className="overflow-y-scroll border-t-1 border-white py-10">
        {list && <MediaList mediaList={mediaList} isRanking={list.isRanking} />}
      </div>
    </div>
  );
}
