import SortButton from "../../components/Buttons/SortButton";

export default function SortUsers(props) {
  const { users, setUsers, initialUsers } = props;

  const sortOptions = [
    { label: "Relevance", value: "relevant" },
    { label: "Followers", value: "followers" },
    { label: "A - Z", value: "alphabet" },
    { label: "Z - A", value: "rev-alphabet" },
  ];

  function sortMethod(sortValue) {
    if (sortValue === "relevant") {
      return [...initialUsers];
    }

    return users.sort((a, b) => {
      switch (sortValue) {
        case "followers":
          return b.followers.total - a.followers.total;
        case "alphabet":
          return a.username.localeCompare(b.username);
        case "rev-alphabet":
          return b.username.localeCompare(a.username);
        default:
          return 0;
      }
    });
  }

  return (
    <SortButton
      results={users}
      setResults={setUsers}
      sortOptions={sortOptions}
      sortMethod={sortMethod}
    />
  );
}
