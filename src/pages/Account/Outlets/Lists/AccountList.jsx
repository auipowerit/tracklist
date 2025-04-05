import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "src/components/Loading";
import { useAuthContext } from "src/context/Auth/AuthContext";
import MediaListCard from "src/components/Cards/MediaListCard";
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

function ListHeader({ name, tags }) {
  return (
    <div className="flex items-center justify-between align-middle">
      <p className="text-2xl text-white">{name}</p>
      <div className="flex gap-2">
        {tags.map((tag, index) => {
          return (
            <p key={index} className="rounded-sm bg-gray-600 p-2">
              {tag}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function MediaList({ mediaList, isRanking }) {
  return (
    <div className="grid grid-cols-4">
      {mediaList?.length > 0 &&
        mediaList.map((media, index) => {
          return (
            <Link key={media.id} to={media.link} className="w-48">
              <MediaListCard
                title={media.title}
                subtitle={media.subtitle}
                image={media.image}
                index={isRanking && index + 1}
              />
            </Link>
          );
        })}
    </div>
  );
}
