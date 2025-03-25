import { useState } from "react";

export function useSpotify() {
  const CLIENT_ID = "548a9a9d3fde4f158dd279cd9b6611bf";
  const CLIENT_SECRET = "36cc595e343e4d9ea93827c801a7fd49";

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

  async function searchByName(name, category) {
    if (!name || !category) return [];
    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${name}&type=${category}&limit=25`,
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

  async function searchArtistById(artistId) {
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

  async function getArtistAlbums(artistId) {
    if (!artistId) return [];
    const access_token = accessToken || (await fetchAccessToken());

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US`,
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

  return {
    fetchAccessToken,
    searchByName,
    searchArtistById,
    getArtistAlbums,
    getArtistSingles,
    getAlbumTracks,
    getAlbumById,
  };
}
