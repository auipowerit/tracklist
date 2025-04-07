import { useEffect, useState } from "react";
import Loading from "src/components/Loading";
import ProfileCard from "src/components/Cards/ProfileCard";
import { useAuthContext } from "src/context/Auth/AuthContext";

export default function FriendsList(props) {
  const { userId, category } = props;

  const { getFollowingById, getFollowersById, getUserById } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) return;

      setIsLoading(true);

      try {
        const fetchedUsers =
          category === "following"
            ? await getFollowingById(userId)
            : await getFollowersById(userId);

        const fetchedUsersDetails = await Promise.all(
          fetchedUsers?.map(async (id) => {
            const user = await getUserById(id);
            return {
              id,
              ...user,
            };
          }) || [],
        );

        setUsers(fetchedUsersDetails);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [userId, category]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen overflow-y-scroll">
      {users &&
        (users.length > 0 ? (
          <ul className="flex w-full flex-col gap-4">
            {users.map((user) => {
              return <ProfileCard key={user.id} user={user} />;
            })}
          </ul>
        ) : (
          <p className="m-20 text-center text-2xl text-gray-300 italic">
            {category === "following"
              ? "You're not following anyone yet."
              : "You don't have any followers yet."}
          </p>
        ))}
    </div>
  );
}
