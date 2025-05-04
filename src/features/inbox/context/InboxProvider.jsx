import { useInbox } from "../hooks/useInbox";
import InboxContext from "./InboxContext";

export default function InboxProvder({ children }) {
  const useInboxMethods = useInbox();

  const InboxMethods = {
    ...useInboxMethods,
  };

  return (
    <InboxContext.Provider value={InboxMethods}>
      {children}
    </InboxContext.Provider>
  );
}
