import { useEffect, useState } from "react";
import { useAuthContext } from "src/context/Auth/AuthContext";
import { useListContext } from "src/context/List/ListContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function ListDataFetcher({ listId }) {
  const { globalUser } = useAuthContext();
  const { getListById } = useListContext();
  const { getMediaById, getMediaLinks } = useSpotifyContext();

  const [list, setList] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (!globalUser || !listId) return;

    const fetchData = async () => {
      try {
        const list = await getListById(listId, globalUser.uid);

        const listItems = await Promise.all(
          list.media.map(async (media) => {
            const fetchedMedia = await getMediaById(media.id, media.category);
            const data = getMediaLinks(fetchedMedia);

            return {
              id: fetchedMedia.id,
              category: media.category,
              ...data,
            };
          }),
        );

        setList(list);
        setItems(listItems);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [globalUser, listId]);

  return { list, items, setItems };
}
