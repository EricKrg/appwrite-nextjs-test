import { useRouter } from 'next/navigation'
import { AppwriteSerivce } from '../services/appwrite.service'
import { useUser } from './user'
import { HiOutlineLogout } from 'react-icons/hi'
import React from 'react'

export default function Logout (): JSX.Element {
  const appwrite = AppwriteSerivce.getInstance()
  const { user, change } = useUser()
  const router = useRouter()
  return <button onClick={() => {
    void (async () => {
      await appwrite.logOutCurruentUser()
      router.push('/login')
      await change(null)
    })()
  }}><HiOutlineLogout/></button>
}
