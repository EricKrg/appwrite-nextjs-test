import { Models } from "appwrite";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiIdentification, HiLogin, HiOutlineArrowCircleLeft } from "react-icons/hi";
import NewUser from "../../components/NewUser";
import { useUser } from "../../components/user";
import { AppwriteSerivce } from "../../services/appwrite.service";

export default function Login(params: any) {
    const [email, setEmail] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);
    const [pw, setPw] = useState("");
    const appwrite = AppwriteSerivce.getInstance();
    const router = useRouter();
    const { user, change } = useUser();
    return (<>
        <h1 className="content-heading">Login</h1>
        <div className="flex flex-col m-auto items-center gap-3">
            {isNewUser ?
                <div className="flex flex-col gap-4 items-center">
                    
                    <NewUser callback={(state:boolean) => {
                        console.log("go back", state)
                        setIsNewUser(state)
                    }
                        } />
                </div> :
                <div className="fade-in flex flex-col gap-4 items-center">
                    <input type="text" className="p-2 rounded-2xl" placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" className="p-2 rounded-2xl" placeholder="Password" onChange={(e) => setPw(e.target.value)}></input>
                    <div className="flex flex-row gap-4">
                        <button className="login" onClick={async () => {
                            const res = await appwrite.loginViaMail(email, pw);
                            console.log("token", res);
                            const user = await appwrite.getCurrentUser();
                            console.log("user", user)
                            change(user);
                            router.push("/");
                        }}><HiLogin /></button>
                        <button className="login" onClick={() => setIsNewUser(true)}><HiIdentification /></button>
                    </div>

                </div>}

        </div>
    </>)
}