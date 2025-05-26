import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { DEFAULT_MEDIA_IMG } from "src/data/const";
import Loading from "src/features/shared/components/Loading";
import MediaGradient from "src/features/shared/components/MediaGradient";
import { useSpotifyContext } from "src/features/media/context/SpotifyContext";
import MobileBanner from "src/features/shared/components/banner/MobileBanner";
import MediaNavBar from "src/features/media/components/nav/MediaNavBar";
import MediaBanner from "src/features/media/components/banner/MediaBanner";
import "./media.scss";

export default function MediaPage() {
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

  const category = useMemo(() => {
    return params.trackId ? "track" : params.albumId ? "album" : "artist";
  }, [params.trackId, params.albumId]);

  const memoizedMedia = useMemo(() => media, [media]);

  const previousArtistId = useRef(null);
  const previousAlbumId = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, [params]);

  useEffect(() => {
    if (activeTab === "reviews") return;
    setFilter("all");
  }, [activeTab]);

  async function fetchMedia() {
    try {
      const artistId = params.artistId;
      const albumId = params.albumId;
      const trackId = params.trackId;

      const fetchedArtist = await fetchArtist(artistId);
      const fetchedAlbum = await fetchAlbum(albumId);
      const fetchedTrack = await fetchTrack(trackId);

      const newMedia = {
        artist: fetchedArtist || media.artist,
        album: fetchedAlbum,
        track: fetchedTrack || null,
      };

      if (!isEqual(media, newMedia)) {
        setMedia(newMedia);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchArtist(artistId) {
    if (artistId && artistId !== previousArtistId.current) {
      setIsLoading(true);
      const artist = await getMediaById(artistId, "artist");
      previousArtistId.current = artistId;
      return artist;
    }

    return null;
  }

  async function fetchAlbum(albumId) {
    if (albumId && albumId !== previousAlbumId.current) {
      setIsLoading(true);
      const album = await getMediaById(albumId, "album");
      previousAlbumId.current = albumId;
      return album;
    } else if (!albumId) {
      previousAlbumId.current = null;
      return null;
    }

    return media.album;
  }

  async function fetchTrack(trackId) {
    if (trackId) {
      setIsLoading(true);
      const track = await getMediaById(trackId, "track");
      return track;
    }

    return null;
  }

  function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  if (isLoading) {
    return <section className="media"></section>;
  }

  return (
    <section className="media">
      <MobileBanner
        title={
          memoizedMedia.track?.name ||
          memoizedMedia.album?.name ||
          memoizedMedia.artist?.name
        }
        onClick={() => window.history.back()}
      />
      <MediaGradient
        image={
          memoizedMedia.album?.images?.[0]?.url ||
          memoizedMedia.artist?.images?.[0]?.url ||
          DEFAULT_MEDIA_IMG
        }
      />
      <MediaNavBar
        artist={memoizedMedia.artist}
        album={memoizedMedia.album}
        track={memoizedMedia.track}
        category={category}
      />
      <div className="media__content">
        <MediaBanner
          media={
            memoizedMedia.track || memoizedMedia.album || memoizedMedia.artist
          }
          category={category}
          setActiveTab={setActiveTab}
          setFilter={setFilter}
        />

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
    </section>
  );
}
