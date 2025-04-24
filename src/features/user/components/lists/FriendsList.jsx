import { useEffect, useState } from "react";
import Loading from "src/features/shared/components/Loading";
import UserCard from "src/features/user/components/cards/UserCard";
import { useAuthContext } from "src/features/auth/context/AuthContext";

export default function FriendsList({ activeTab, user }) {
  const { getFollowingById, getFollowersById, getUserById } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);

      try {
        const fetchedUsers =
          activeTab === "following"
            ? await getFollowingById(user.uid)
            : await getFollowersById(user.uid);

        const fetchedUsersDetails = await Promise.all(
          fetchedUsers?.map(async (uid) => {
            const user = await getUserById(uid);
            return {
              uid,
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
  }, [user, activeTab]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen overflow-y-scroll">
      {users &&
        (users.length > 0 ? (
          <ul className="flex w-full flex-col gap-4">
            {users.map((user) => {
              return <UserCard key={user.uid} user={user} />;
            })}
          </ul>
        ) : (
          <p className="m-20 text-center text-2xl text-gray-300 italic">
            {activeTab === "following"
              ? "No one followed yet!"
              : "No followers yet!"}
          </p>
        ))}
    </div>
  );
}
