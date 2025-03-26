import { formatDateMDYLong } from "../../utils/date";

export default function MediaCard(props) {
  const { media, category, rating, onClick } = props;

  const defaultDate = "01/01/2000";
  const defaultImg = "/images/default-img.jpg";

  function getMediaDetails() {
    switch (category) {
      case "artist":
        return {
          title: media.name,
          image: media?.images?.[0]?.url || defaultImg,
          subtitle: (
            <>
              {media.followers.total.toLocaleString()}{" "}
              {media.followers.total === 1 ? "Follower" : "Followers"}
            </>
          ),
        };
      case "album":
        return {
          title: media.name,
          image: media?.images?.[0]?.url || defaultImg,
          subtitle: <>{formatDateMDYLong(media.release_date) || defaultDate}</>,
        };
      case "track":
        return {
          title: media.name,
          image:
            media?.album?.images?.[0]?.url ||
            media?.images?.[0]?.url ||
            defaultImg,
          subtitle: (
            <>
              {formatDateMDYLong(
                media?.album?.release_date || media?.release_date,
              ) || defaultDate}
            </>
          ),
        };
    }
  }

  const { title, subtitle, image } = getMediaDetails();

  return (
    <div
      className="flex min-h-[400px] w-[300px] cursor-pointer flex-col bg-white p-2 text-black transition-all duration-200 hover:scale-110"
      onClick={onClick}
    >
      <img src={image} className="h-[300px] w-[300px]" />
      <div className="flex grow-1 flex-col justify-between gap-2 py-2 text-center">
        <p className="text-xl font-bold">{title}</p>
        <p className="text-sm font-light">{subtitle}</p>
      </div>

      {rating}
    </div>
  );
}
