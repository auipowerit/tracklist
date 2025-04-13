import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListContext } from "src/context/List/ListContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";

export default function ListDataFetcher({ listId, user, canEdit }) {
  const navigate = useNavigate();

  const { getListById } = useListContext();
  const { getMediaById, getMediaLinks } = useSpotifyContext();

  const [list, setList] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (!listId || !user) return;

    fetchListData();
  }, [listId, user]);

  async function fetchListData() {
    try {
      const list = await getListById(listId, user.uid);

      if (!list) return;

      if (list.isPrivate && !canEdit) {
        navigate(`/users/${user.username}/lists`);
        return;
      }

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
  }

  return { list, items, setItems };
}
