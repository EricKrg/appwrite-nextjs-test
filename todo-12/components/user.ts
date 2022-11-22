import { Models } from "appwrite";
import { createContext, useContext } from "react";

export const UserContext = createContext<{user: Models.Preferences | null, change: (change: any| null) => void }>({user: null, change:(i: any| null) => {}});

export const useUser = () => {
  const user = useContext<{user: Models.Preferences | null, change: (change: any | null) => void }>(UserContext);
  return  user;
};

