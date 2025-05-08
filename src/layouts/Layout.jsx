import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { db } from "src/config/firebase.js";
import { doc, onSnapshot } from "firebase/firestore";
import { useChatContext } from "src/features/chat/context/ChatContext.js";
import { useAuthContext } from "src/features/auth/context/AuthContext.js";
import Footer from "./Footer";
import ToTop from "./buttons/ToTop.jsx";
import Navbar from "./navbar/Navbar.jsx";
import MobileNavbar from "./navbar/MobileNavbar.jsx";

export default function Layout() {
  const { globalUser, getUnreadInbox } = useAuthContext();
  const { chats, getUnreadChatsByUserId } = useChatContext();

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    if (!globalUser) {
      setUnreadMessages(0);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "userchats", globalUser.uid),
      async () => {
        const chatCount = await getUnreadChatsByUserId(globalUser.uid);
        setUnreadMessages(chatCount);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [globalUser, chats]);

  useEffect(() => {
    if (!globalUser) {
      setUnreadNotifs(0);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "users", globalUser.uid),
      async () => {
        const inboxCount = await getUnreadInbox(globalUser.uid);
        setUnreadNotifs(inboxCount);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [globalUser]);

  return (
    <div className="wrapper">
      <Navbar unreadMessages={unreadMessages} unreadNotifs={unreadNotifs} />

      <main>
        <Outlet />
      </main>

      <ToTop />
      <Footer />

      <MobileNavbar
        unreadMessages={unreadMessages}
        unreadNotifs={unreadNotifs}
      />
    </div>
  );
}
