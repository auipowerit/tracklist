import SortButton from "./buttons/SortButton";

export default function SortComments({ comments, setComments, sortMethod }) {
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Best", value: "best" },
    { label: "Controversial", value: "worst" },
  ];

  return (
    <SortButton
      results={comments}
      setResults={setComments}
      sortOptions={sortOptions}
      sortMethod={sortMethod}
    />
  );
}
