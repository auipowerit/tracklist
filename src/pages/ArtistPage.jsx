import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import Loading from "src/features/shared/components/Loading";
import MediaGradient from "src/features/shared/components/MediaGradient";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import MediaNavBar from "../features/media/components/nav/MediaNavBar";
import MediaBanner from "../features/media/components/MediaBanner";
import "./styles/artist.scss";

export default function ArtistPage() {
  const { getMediaById } = useSpotifyContext();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState({
    artist: null,
    album: null,
    track: null,
  });

  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("");

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
    <div className="artist-page-container">
      <MediaGradient
        image={
          memoizedMedia.album?.images?.[0]?.url ||
          memoizedMedia.artist?.images?.[0]?.url ||
          DEFAULT_MEDIA_IMG
        }
      />

      <div className="artist-page">
        <MediaNavBar
          artist={memoizedMedia.artist}
          album={memoizedMedia.album}
          track={memoizedMedia.track}
          category={category}
        />
        <div className="artist-page-content">
          <MediaBanner
            media={
              memoizedMedia.track || memoizedMedia.album || memoizedMedia.artist
            }
            category={category}
            setActiveTab={setActiveTab}
            setFilter={setFilter}
          />

          <div className="artist-page-outlet">
            <Outlet
              context={{
                artist: memoizedMedia.artist,
                album: memoizedMedia.album,
                track: memoizedMedia.track,
                activeTab: activeTab,
                setActiveTab: setActiveTab,
                filter: filter,
                setFilter: setFilter,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
