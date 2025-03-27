import SortMusic from "../../components/Sort/SortMusic";
import MediaCard from "../../components/Cards/MediaCard";

export default function Singles({ singles, setSingles }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <p className="text-4xl font-bold">Singles</p>

        <SortMusic
          results={singles}
          setResults={setSingles}
          initialResults={singles}
          category={"track"}
          search={false}
        />
      </div>

      {singles && singles.length > 0 ? (
        <div className="grid grid-cols-3 gap-8">
          {singles.map((track) => {
            return (
              <MediaCard key={track.id} media={track} category={"track"} />
            );
          })}
        </div>
      ) : (
        <p className="p-20 text-center text-5xl italic">Nothing to show!</p>
      )}
    </div>
  );
}
