import { HiMoon, HiSun } from "react-icons/hi";
import useDarkMode from "../hooks/useDarkMode";

export default function Layout({ children }: {
    children: React.ReactNode
}) {
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

const DarkModeToggle = () => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => {
        console.log("dark toggle", darkTheme)
        setDarkTheme(!darkTheme)
    };
    return (
        <div className="fixed top-0 left-1/2 m-4" onClick={handleMode}>
                {darkTheme ? <HiSun className="text-white"/> :<HiMoon />}
            </div>
    )
}