import { useState } from "react";

export function useSpotify() {
  const CLIENT_ID = "34e1029a79a849e4961c3de724acaca9";
  const CLIENT_SECRET = "7c8f58ab81fa49fbbe5d2d1943193ce1";

  const defaultImg = "/images/default-img.jpg";

  const [accessToken, setAccessToken] = useState("");

  async function fetchAccessToken() {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      });
      const data = await response.json();

      setAccessToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.log(error);
    }
  }

  async function searchByName(name, category, limit = 25) {
    if (!name || !category) return [];
    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${name}&type=${category}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const results = await response.json();

      return results || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function getArtistAlbums(artistId) {
    if (!artistId) return [];
    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US&limit=50`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const albums = await response.json();

      return albums.items || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function getArtistSingles(artistId) {
    if (!artistId) return [];
    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single&market=US&limit=50`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const singles = await response.json();

      return singles.items || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function getAlbumTracks(albumId) {
    if (!albumId) return [];
    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}/tracks?market=US`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const tracks = await response.json();

      return tracks.items || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function getMediaById(mediaId, category) {
    if (!mediaId || !category) return [];

    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/${category}s/${mediaId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (response.status === 400) {
        throw new Error("No media found!");
      }

      const media = await response.json();

      const image =
        media.images?.[0]?.url || media.album?.images?.[0]?.url || defaultImg;

      const formattedMedia = {
        ...media,
        image,
      };

      return formattedMedia || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function getArtistById(artistId) {
    if (!artistId) return [];
    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (response.status === 400) {
        throw new Error("No artist found!");
      }

      const artist = await response.json();

      return artist || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function getAlbumById(albumId) {
    if (!albumId) return;
    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}?market=US`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      const album = await response.json();

      return album || null;
    } catch (error) {
      console.error(error);
    }
  }

  async function getTrackById(trackId) {
    if (!trackId) return;
    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}?market=US`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      console.log(response);
      const track = await response.json();

      return track || null;
    } catch (error) {
      console.error(error);
    }
  }

  function getMediaLinks(media) {
    const artist = media?.artists?.[0] || media || {};
    const artistURL = `/artists/${artist?.id}`;

    const mediaData = {
      title: media?.name,
      image: media?.images?.[0]?.url || defaultImg,
    };

    if (media.type === "artist") {
      mediaData.titleLink = artistURL;
    } else if (media.type === "album") {
      mediaData.titleLink = `${artistURL}/albums/${media?.id}`;
      mediaData.subtitle = media?.artists?.[0]?.name;
      mediaData.subtitleLink = artistURL;
    } else if (media.type === "track") {
      mediaData.titleLink = `${artistURL}/albums/${media?.album?.id}/tracks/${media?.id}`;
      mediaData.subtitle = media?.artists?.[0]?.name;
      mediaData.subtitleLink = artistURL;
    }

    return mediaData;
  }

  return {
    defaultImg,
    fetchAccessToken,
    searchByName,
    getArtistAlbums,
    getArtistSingles,
    getAlbumTracks,
    getMediaById,
    getArtistById,
    getAlbumById,
    getTrackById,
    getMediaLinks,
  };
}
