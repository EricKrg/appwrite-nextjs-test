import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HiIdentification, HiLogin } from 'react-icons/hi'
import NewUser from '../../components/NewUser'
import { useUser } from '../../components/user'
import { AppwriteSerivce } from '../../services/appwrite.service'

export default function Login (): JSX.Element {
  const [email, setEmail] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [isLoginFailed, setIsLoginFailed] = useState(false)
  const [pw, setPw] = useState('')
  const appwrite = AppwriteSerivce.getInstance()
  const router = useRouter()
  const { user, change } = useUser()

  useEffect(() => {
    if (isLoginFailed) {
      setTimeout(() => {
        setIsLoginFailed(false)
      }, 3000)
    }
  }, [isLoginFailed])

  const onLogin = async (): Promise<void> => {
    try {
      await appwrite.loginViaMail(email, pw)
    } catch (error) {
      console.log('login error', error)
      setIsLoginFailed(true)
      setPw('')
      return
    }

    const user = await appwrite.getCurrentUser()
    console.log('Logged in', user)
    await change(user)
    await router.push('/')
  }

  return (<>
    <h1 className="content-heading">Login</h1>
    <div className="flex flex-col m-auto items-center gap-3">
      {isNewUser
        ? <div className="flex flex-col gap-4 items-center">
          <NewUser callback={(state: boolean) => {
            console.log('go back', state)
            setIsNewUser(state)
          }
          } />
        </div>
        : <form className="fade-in flex flex-col gap-4 items-center"
          action=''
          onSubmit={(event: any) => {
            event.preventDefault()
            void (async () => {
              event.preventDefault()
              await onLogin()
            })()
          }}>
          <input type="text" className="p-2 rounded-2xl" placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
          <input type="password" className="p-2 rounded-2xl" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)}></input>
          <div className="flex flex-row gap-4">
            <div className='tooltip tooltip-bottom' data-tip="login with credentials">
              <button className="login" onClick={
                () => {
                  void (async (): Promise<void> => await onLogin())()
                }
              }><HiLogin /></button>
            </div>
            <div className='tooltip tooltip-bottom' data-tip="register as a new user">
              <button className="login" onClick={() => setIsNewUser(true)}><HiIdentification /></button>
            </div>
          </div>
        </form>}
      {isLoginFailed
        ? <div className="toast toast-bottom toast-center w-max z-50">
          <div className="alert alert-error p-3">
            <div>
              <span className='font-semibold text-sm'>Login Failed, check credentials!</span>
            </div>
          </div>
        </div>
        : null}
    </div>
  </>)
}
