import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import Loading from "src/components/Loading";
import { useSpotifyContext } from "src/context/Spotify/SpotifyContext";
import MediaReviews from "./MediaReviews";
import ArtistNavigation from "./ArtistNavigation";
import { useReviewContext } from "src/context/Review/ReviewContext";

export default function ArtistPage() {
  const { getArtistById, getAlbumById, getTrackById } = useSpotifyContext();
  const { getReviewsByMediaId } = useReviewContext();

  const params = useParams();
  const [media, setMedia] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
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

        setMedia({
          id: mediaId,
          category,
          artist: fetchedMedia[0] || null,
          album: fetchedMedia[1] || null,
          track: fetchedMedia[2] || null,
        });

        const fetchedReviews = await getReviewsByMediaId(mediaId);

        setReviews(
          [...fetchedReviews].sort((a, b) => b.createdAt - a.createdAt),
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchMedia();
  }, [params]);

  if (!media.id) {
    return <Loading />;
  }

  return (
    <div className="mx-10 mt-6 flex flex-col gap-2">
      <ArtistNavigation media={media} category={media.category} />
      <div className="flex gap-8">
        <Outlet context={media} />
        <MediaReviews
          mediaId={media.id}
          reviews={reviews}
          category={media.category}
        />
      </div>
    </div>
  );
}
