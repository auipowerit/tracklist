import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import SortMusic from "../components/Sort/SortMusic";
import MediaCard from "../components/Cards/MediaCard";
import { useSpotifyContext } from "../context/Spotify/SpotifyContext";

export default function ArtistPage() {
  const { getArtistById, getArtistAlbums, getArtistSingles } =
    useSpotifyContext();

  const [isLoading, setIsLoading] = useState(true);
  const [artist, setArtist] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  const params = useParams();
  const artistId = params?.artistId;

  useEffect(() => {
    const getArtistData = async () => {
      setIsLoading(true);

      try {
        const fetchedArtist = await getArtistById(artistId);
        const fetchedAlbums = await getArtistAlbums(artistId);
        const fetchedTracks = await getArtistSingles(artistId);

        setArtist(fetchedArtist);
        setAlbums(fetchedAlbums);
        setTracks(fetchedTracks);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getArtistData();
  }, [artistId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 p-6">
      {artist && (
        <MediaCard
          media={artist}
          category={"artist"}
          onClick={() => window.open(artist.external_urls.spotify)}
        />
      )}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="text-4xl font-bold">Albums</p>

            <SortMusic
              results={albums}
              setResults={setAlbums}
              initialResults={albums}
              category={"album"}
            />
          </div>

          {albums && albums.length > 0 ? (
            <div className="grid grid-cols-4 gap-8">
              {albums.map((album) => {
                return (
                  <MediaCard key={album.id} media={album} category={"album"} />
                );
              })}
            </div>
          ) : (
            <p className="p-20 text-center text-5xl italic">Nothing to show!</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="text-4xl font-bold">Singles</p>

            <SortMusic
              results={tracks}
              setResults={setTracks}
              initialResults={tracks}
              category={"track"}
            />
          </div>

          {tracks && tracks.length > 0 ? (
            <div className="grid grid-cols-4 gap-8">
              {tracks.map((track) => {
                return (
                  <MediaCard key={track.id} media={track} category={"track"} />
                );
              })}
            </div>
          ) : (
            <p className="p-20 text-center text-5xl italic">Nothing to show!</p>
          )}
        </div>
      </div>
    </div>
  );
}
