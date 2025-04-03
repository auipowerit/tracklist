import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { getColorPalette, getColors } from "src/utils/colors";
import { useReviewContext } from "src/context/Review/ReviewContext";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import MediaReviews from "./MediaReviews";
import ArtistNavigation from "./ArtistNavigation";

export default function ArtistPage() {
  const { getArtistById, getAlbumById, getTrackById } = useSpotifyContext();
  const { getReviewsByMediaId } = useReviewContext();

  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState(null);
  const [reviews, setReviews] = useState(null);

  const [colors, setColors] = useState({
    light: "#ffffff",
    dark: "#000000",
    text: "#000000",
  });
  const [palette, setPalette] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);

      try {
        setReviews(null);

        const artistId = params.artistId;
        const albumId = params.albumId;
        const trackId = params.trackId;

        const mediaId = trackId || albumId || artistId;
        const category = trackId ? "track" : albumId ? "album" : "artist";

        const fetchedMedia = await Promise.all([
          artistId && getArtistById(artistId),
          albumId && getAlbumById(albumId),
          trackId && getTrackById(trackId),
        ]);

        const imageURL =
          fetchedMedia[1]?.images[0].url || fetchedMedia[0].images[0].url;

        const colors = await getColors(imageURL);
        setColors(colors);

        const palette = await getColorPalette(imageURL);
        setPalette(palette);

        setMedia({
          id: mediaId,
          category,
          artist: fetchedMedia[0] || null,
          album: fetchedMedia[1] || null,
          track: fetchedMedia[2] || null,
          colors: colors,
        });

        const fetchedReviews = await getReviewsByMediaId(mediaId);
        setReviews(
          [...fetchedReviews].sort((a, b) => b.createdAt - a.createdAt),
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [params]);

  return (
    <div className="flex h-full gap-8">
      <MediaGradient light={colors.light} dark={colors.dark} />

      <div className="flex flex-2 flex-col">
        <ArtistNavigation
          media={media}
          category={media?.category}
          color={colors?.text}
        />
        <div className="px-6">{!isLoading && <Outlet context={media} />}</div>
      </div>

      <div className="h-full flex-1 bg-[rgba(20,20,20,0.6)]">
        <MediaReviews
          key={media?.id}
          mediaId={media?.id}
          reviews={reviews}
          setReviews={setReviews}
          category={media?.category}
        />
      </div>
    </div>
  );
}

function MediaGradient({ light, dark }) {
  return (
    <div
      className="moving-gradient"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `linear-gradient(to bottom right, ${light}, ${dark})`,
        filter: "blur(100px)",
        zIndex: -1,
      }}
    />
  );
}

function MediaColorPalette({ palette }) {
  return (
    <div className="flex gap-2">
      {palette &&
        palette.map((color) => {
          return (
            <div
              key={color.name}
              style={{
                backgroundColor: color.color,
                padding: 5,
                height: 50,
              }}
            >
              {color.name}
            </div>
          );
        })}
    </div>
  );
}
