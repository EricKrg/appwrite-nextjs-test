import { Models } from 'appwrite'
import { createContext, useContext } from 'react'

export interface UserContextProp {
  user: Models.Preferences | null
  change: (change: any | null) => Promise<void>
}

export const UserContext = createContext<UserContextProp>({ user: null, change: async (i: any | null) => undefined })

export const useUser = (): UserContextProp => {
  const user = useContext<UserContextProp>(UserContext)
  return user
}
