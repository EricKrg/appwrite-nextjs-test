import { useRouter } from "next/navigation";
import { AppwriteSerivce } from "../services/appwrite.service";
import { useUser } from "./user";
import {HiOutlineLogout} from "react-icons/hi";

export default function Logout() {
    const appwrite = AppwriteSerivce.getInstance();
    const {user, change} = useUser();
    const router = useRouter();
    return <button  onClick={() => {
        appwrite.logOutCurruentUser();
        router.push("/login");
        change(null);
    }}><HiOutlineLogout/></button>
}