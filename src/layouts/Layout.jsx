import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { db } from "src/config/firebase.js";
import { doc, onSnapshot } from "firebase/firestore";
import { useChatContext } from "src/features/chat/context/ChatContext.js";
import { useAuthContext } from "src/features/auth/context/AuthContext.js";
import ToTop from "./buttons/ToTop.jsx";
import Footer from "./footer/Footer.jsx";
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
      setUnreadNotifs(0);
      return;
    }

    const unsubscribeChats = onSnapshot(
      doc(db, "userchats", globalUser.uid),
      async () => {
        const chatCount = await getUnreadChatsByUserId(globalUser.uid);
        setUnreadMessages(chatCount);
      },
    );

    const unsubscribeNotifications = onSnapshot(
      doc(db, "users", globalUser.uid),
      async () => {
        const inboxCount = await getUnreadInbox(globalUser.uid);
        setUnreadNotifs(inboxCount);
      },
    );

    return () => {
      unsubscribeChats();
      unsubscribeNotifications();
    };
  }, [globalUser, chats]);

  return (
    <div className="wrapper">
      <Navbar unreadMessages={unreadMessages} unreadNotifs={unreadNotifs} />

      <main>
        <Outlet />
      </main>

      <ToTop />

      <MobileNavbar
        unreadMessages={unreadMessages}
        unreadNotifs={unreadNotifs}
      />
      <Footer />
    </div>
  );
}
