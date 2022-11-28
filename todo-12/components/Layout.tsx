import { HiMoon, HiSun } from 'react-icons/hi'
import useDarkMode from '../hooks/useDarkMode'
import React from 'react'

export default function Layout ({ children }: { children: React.ReactNode }): JSX.Element {
  return (
        <div className="flex">
            <div className="content-container">
                <div className="content-container-inner">
                    {children}
                </div>
            </div>
            <DarkModeToggle></DarkModeToggle>
        </div>)
}

const DarkModeToggle = (): JSX.Element => {
  const [darkTheme, setDarkTheme] = useDarkMode()
  const handleMode = (): void => {
    console.log('dark toggle', darkTheme)
    setDarkTheme(!darkTheme)
  }
  return (
        <div className="fixed flex items-center flex-col w-full bottom-0">
            <div className="hover:animate-pulse rounded-3xl hover:bg-slate-200
          dark:hover:bg-slate-600 p-2 m-1 transition-all duration-150 ease-linear cursor-pointer" onClick={handleMode}>
                {darkTheme ? <HiSun className="text-white" /> : <HiMoon className="text-slate-700" />}
            </div>
        </div>

  )
}
