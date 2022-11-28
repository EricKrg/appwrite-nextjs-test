import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HiFingerPrint, HiIdentification, HiOutlineArrowCircleLeft } from 'react-icons/hi'
import AppwriteSerivce from '../services/appwrite.service'
import { useUser } from './user'

export default function NewUser (showUserReg: { callback: (state: boolean) => void }): JSX.Element {
  const appwrite = AppwriteSerivce.getInstance()
  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [pw, setPw] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { user, change } = useUser()
  const router = useRouter()

  useEffect(() => {
    console.log(name, email, pw)
    if (
      (name !== null && name !== '') &&
      (email !== null && email !== '') &&
      (pw !== null && pw !== '')) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }, [name, email, pw])

  return (<>
     { isLoading
       ? <HiFingerPrint className="w-10 h-10 animate-bounce"></HiFingerPrint>

       : <div className="fade-in flex flex-col gap-4 items-center">
            <button className="login" onClick={() => showUserReg.callback(false)}><HiOutlineArrowCircleLeft /></button>
            <input type="text" className="p-2 rounded-2xl" placeholder="Name" onChange={(e) => setName(e.target.value)}></input>
            <input type="text" className="p-2 rounded-2xl" placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
            <input type="password" className="p-2 rounded-2xl" placeholder="Password" onChange={(e) => setPw(e.target.value)}></input>
            <button disabled={isDisabled} className="login" onClick={
              () => {
                void (async () => {
                  setIsLoading(true)
                  const res = await appwrite.createNewUser(name!, email!, pw!)
                  console.log('new user', res)
                  await appwrite.loginViaMail(email!, pw!)
                  console.log('token', res)
                  const user = await appwrite.getCurrentUser()
                  console.log('user', user)
                  await change(user)
                  setIsLoading(false)
                  await router.push('/')
                })()
              }
            }><HiIdentification /></button>
        </div>}
    </>)
}
