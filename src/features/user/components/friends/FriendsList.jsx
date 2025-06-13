import { useEffect, useState } from "react";
import UserCard from "src/features/user/components/cards/UserCard";
import { useAuthContext } from "src/features/auth/context/AuthContext";

export default function FriendsList({ activeTab, user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(null);

  const { getFollowingById, getFollowersById, getUserById } = useAuthContext();

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
            if (!user) {
              return null;
            }
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

  if (isLoading || !user) {
    return null;
  }

  if (users.length === 0) {
    return (
      <div className="account-friends-container">
        <p className="empty__message">
          {activeTab === "following"
            ? "No one followed yet!"
            : "No followers yet!"}
        </p>
      </div>
    );
  }

  return (
    <div className="account-friends-container">
      <ul className="account-friends-list">
        {users.map((user) => {
          if (!user) return null;

          return <UserCard key={user.uid} user={user} />;
        })}
      </ul>
    </div>
  );
}
