import { Models } from "appwrite";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiLogin } from "react-icons/hi";
import { useUser } from "../../components/user";
import { AppwriteSerivce } from "../../services/appwrite.service";

export default function Login(params:any) {
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const appwrite = AppwriteSerivce.getInstance();
    const router = useRouter();
    const {user, change} = useUser();
    return (<>
        <h1 className="content-heading">Login</h1>
        <div className="flex flex-col m-auto items-center gap-3">
            <input type="text" className="p-2 rounded-2xl" placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
            <input type="password" className="p-2 rounded-2xl" placeholder="Password" onChange={(e) => setPw(e.target.value)}></input>       
        <button className="login" onClick={async () => {
            const res = await appwrite.loginViaMail(email, pw);
            console.log("token", res);
            const user = await appwrite.getCurrentUser();
            console.log("user", user)
            change(user);
            router.push("/");
        }}><HiLogin/></button>
        </div>
    </>)
}