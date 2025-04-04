import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaList from "./MediaList";
import ListHeader from "./ListHeader";
import Loading from "src/components/Loading";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function AccountList() {
  const { globalUser, getUserListById } = useAuthContext();
  const { defaultImg, getMediaById } = useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState(null);
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
    <div className="flex h-full flex-col gap-4">
      <ListHeader name={list.name} tags={list.tags} />
      <div className="overflow-y-scroll border-t-1 border-white py-10">
        {list && <MediaList mediaList={mediaList} isRanking={list.isRanking} />}
      </div>
    </div>
  );
}
