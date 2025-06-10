import { useState } from "react";
import * as Const from "src/data/const";

export function useSpotify() {
  const [accessToken, setAccessToken] = useState("");

  async function getAccessToken() {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${Const.CLIENT_ID}&client_secret=${Const.CLIENT_SECRET}`,
      });
      const data = await response.json();

      setAccessToken(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function getAuthAccessToken(AUTH_CODE) {
    const verifier = localStorage.getItem("verifier");

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `client_id=${Const.CLIENT_ID}&grant_type=authorization_code&code=${AUTH_CODE}&redirect_uri=${Const.REDIRECT_URI}&code_verifier=${verifier}`,
    });

    const { access_token } = await result.json();
    return access_token;
  }

  async function redirectToSpotifyAuth() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    document.location = `https://accounts.spotify.com/authorize?client_id=${Const.CLIENT_ID}&response_type=code&redirect_uri=${Const.REDIRECT_URI}&scope=user-read-private user-read-email&code_challenge_method=S256&code_challenge=${challenge}`;
  }

  function generateCodeVerifier(length) {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async function getSpotifyUser(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const profile = await result.json();

    return profile;
  }

  async function searchByName(name, category, limit = 20) {
    if (!name || !category) return [];

    const token = accessToken || (await getAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${name}&type=${category}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      );
      const results = await response.json();

      return results || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function getMediaById(mediaId, category) {
    if (!mediaId || !category) return [];

    const token = accessToken || (await getAccessToken());
    //  console.log(token);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/${category}s/${mediaId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      );

      if (response.status === 400) {
        return null;
      }

      const media = await response.json();

      const image =
        media.images?.[0]?.url ||
        media.album?.images?.[0]?.url ||
        Const.DEFAULT_MEDIA_IMG;

      const formattedMedia = {
        ...media,
        image,
      };

      return formattedMedia || null;
    } catch (error) {
      console.error(error);
    }
  }

  function getMediaLinks(media) {
    if (!media) return {};

    const artist = media?.artists?.[0] || media || {};
    const artistUrl = `/artists/${artist?.id}`;

    const mediaData = {
      title: media?.name,
      titleLink: artistUrl,
      subtitle: "",
      subtitleLink: artistUrl,
      image:
        media?.images?.[0]?.url ||
        media?.album?.images?.[0]?.url ||
        Const.DEFAULT_MEDIA_IMG,
    };

    if (media.type === "artist") {
      mediaData.titleLink = artistUrl;
    } else if (media.type === "album") {
      mediaData.titleLink = `${artistUrl}/albums/${media?.id}`;
      mediaData.subtitle = media?.artists?.[0]?.name;
      mediaData.subtitleLink = artistUrl;
    } else if (media.type === "track") {
      mediaData.titleLink = `${artistUrl}/albums/${media?.album?.id}/tracks/${media?.id}`;
      mediaData.subtitle = media?.artists?.[0]?.name;
      mediaData.subtitleLink = artistUrl;
    }

    return mediaData;
  }

  async function getArtistAlbums(artistId, offset = 0, limit = 10) {
    if (!artistId) return [];

    const token = accessToken || (await getAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US&limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      );

      const albums = await response.json();

      return albums.items || [];
    } catch (error) {
      console.error(error);
    }
  }

  async function getArtistSingles(artistId, offset = 0, limit = 10) {
    if (!artistId) return [];

    const token = accessToken || (await getAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single&market=US&limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
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

    const token = accessToken || (await getAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}/tracks?market=US`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      );

      const tracks = await response.json();

      return tracks.items || [];
    } catch (error) {
      console.error(error);
    }
  }

  return {
    getAccessToken,
    getAuthAccessToken,
    redirectToSpotifyAuth,
    getSpotifyUser,

    searchByName,
    getMediaById,
    getMediaLinks,

    getArtistAlbums,
    getArtistSingles,
    getAlbumTracks,
  };
}
