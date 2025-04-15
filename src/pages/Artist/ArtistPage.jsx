import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import Loading from "src/components/Loading";
import MediaGradient from "src/components/MediaGradient";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import Navigation from "./compontents/Navigation";
import MediaBanner from "./compontents/MediaBanner";

export default function ArtistPage() {
  const { DEFAULT_IMG, getMediaById } = useSpotifyContext();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState({
    artist: null,
    album: null,
    track: null,
  });

  const mediaId = useMemo(() => {
    return params.trackId || params.albumId || params.artistId;
  }, [params]);

  const category = useMemo(() => {
    return params.trackId ? "track" : params.albumId ? "album" : "artist";
  }, [params.trackId, params.albumId]);

  const memoizedMedia = useMemo(() => media, [media]);

  const previousArtistId = useRef(null);
  const previousAlbumId = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, [params]);

  async function fetchMedia() {
    try {
      const artistId = params.artistId;
      const albumId = params.albumId;
      const trackId = params.trackId;

      let fetchedArtist = null;
      if (artistId && artistId !== previousArtistId.current) {
        setIsLoading(true);
        fetchedArtist = await getMediaById(artistId, "artist");
        previousArtistId.current = artistId;
      }

      let fetchedAlbum = media.album;
      if (albumId) {
        if (albumId !== previousAlbumId.current) {
          setIsLoading(true);
          fetchedAlbum = await getMediaById(albumId, "album");
          previousAlbumId.current = albumId;
        }
      } else {
        previousAlbumId.current = null;
        fetchedAlbum = null;
      }

      let fetchedTrack = null;
      if (trackId) {
        setIsLoading(true);
        fetchedTrack = await getMediaById(trackId, "track");
      }

      const newMedia = {
        artist: fetchedArtist || media.artist,
        album: fetchedAlbum,
        track: fetchedTrack || null,
      };

      setMedia((prevMedia) =>
        JSON.stringify(prevMedia) !== JSON.stringify(newMedia)
          ? newMedia
          : prevMedia,
      );
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-full gap-8">
      <MediaGradient
        image={
          memoizedMedia.album?.images?.[0]?.url ||
          memoizedMedia.artist?.images?.[0]?.url ||
          DEFAULT_IMG
        }
      />

      <div className="flex flex-2 flex-col">
        <Navigation
          artist={memoizedMedia.artist}
          album={memoizedMedia.album}
          track={memoizedMedia.track}
          category={category}
        />
        <div className="flex min-h-screen w-full flex-col items-center gap-8">
          <MediaBanner
            media={
              memoizedMedia.track || memoizedMedia.album || memoizedMedia.artist
            }
            category={category}
          />

          <div className="mt-6 flex h-full w-full justify-center bg-black/50">
            <Outlet
              context={{
                artist: memoizedMedia.artist,
                album: memoizedMedia.album,
                track: memoizedMedia.track,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
