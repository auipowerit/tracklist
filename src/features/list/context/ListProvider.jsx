import { useList } from "../hooks/useList";
import ListContext from "./ListContext";

export default function ListProvder({ children }) {
  const useListMethods = useList();

  const listMethods = {
    ...useListMethods,
  };

  return (
    <ListContext.Provider value={listMethods}>{children}</ListContext.Provider>
  );
}
