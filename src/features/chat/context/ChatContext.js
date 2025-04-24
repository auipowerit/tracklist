import { createContext, useContext } from "react";

const ChatContext = createContext();

export function useChatContext() {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error("Error! useChatContext must be used within ChatProvidor.");
  }

  return context;
}

export default ChatContext;
