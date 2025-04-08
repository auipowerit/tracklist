import { createContext, useContext } from "react";

const ListContext = createContext();

export function useListContext() {
  const context = useContext(ListContext);

  if (context === undefined) {
    throw new Error("Error! useListContext must be used within ListProvidor.");
  }

  return context;
}

export default ListContext;
