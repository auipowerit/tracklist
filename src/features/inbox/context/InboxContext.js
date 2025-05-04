import { createContext, useContext } from "react";

const InboxContext = createContext();

export function useInboxContext() {
  const context = useContext(InboxContext);

  if (context === undefined) {
    throw new Error(
      "Error! useInboxContext must be used within InboxProvidor.",
    );
  }

  return context;
}

export default InboxContext;
