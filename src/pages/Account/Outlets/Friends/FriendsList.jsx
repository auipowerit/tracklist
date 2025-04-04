import { useEffect, useState } from "react";
import Loading from "src/components/Loading";
import { useAuthContext } from "src/context/Auth/AuthContext";
import FriendCard from "./FriendCard";

export default function FriendsList(props) {
  const { userId, category } = props;

  const {
    getFollowingById,
    getFollowersById,
    getUserById,
    followUser,
    unfollowUser,
  } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(null);

  async function handleClick(isFollowingUser, fetchedUserId) {
    isFollowingUser
      ? await unfollowUser(userId, fetchedUserId)
      : await followUser(userId, fetchedUserId);

    const updatedusers = users.map((user) => {
      if (user.id === fetchedUserId) {
        return {
          id: user.id,
          ...user,
          followersCount: user.followersCount + (isFollowingUser ? -1 : 1),
          isFollowing: !user.isFollowing,
        };
      }
      return user;
    });

    setUsers(updatedusers);
  }

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
              followersCount: user.followers.length,
              followingCount: user.following.length,
              isFollowing: user.followers.includes(userId),
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
              return (
                <FriendCard
                  key={user.id}
                  user={user}
                  handleClick={handleClick}
                />
              );
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
