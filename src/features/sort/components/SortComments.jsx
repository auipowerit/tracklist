import SortButton from "./buttons/SortButton";

export default function SortComments({ comments, setComments }) {
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Best", value: "best" },
    { label: "Controversial", value: "worst" },
  ];

  function sortMethod(sortValue) {
    return comments.sort((a, b) => {
      switch (sortValue) {
        case "newest":
          return b.createdAt - a.createdAt;

        case "oldest":
          return a.createdAt - b.createdAt;

        case "best":
          return (
            b.likes.length - a.likes.length ||
            a.dislikes.length - b.dislikes.length ||
            b.createdAt - a.createdAt ||
            a.userId.localeCompare(b.userId)
          );

        case "worst":
          return (
            b.dislikes.length - a.dislikes.length ||
            a.likes.length - b.likes.length ||
            b.createdAt - a.createdAt ||
            a.userId.localeCompare(b.userId)
          );

        default:
          return 0;
      }
    });
  }

  return (
    <SortButton
      results={comments}
      setResults={setComments}
      sortOptions={sortOptions}
      sortMethod={sortMethod}
    />
  );
}
