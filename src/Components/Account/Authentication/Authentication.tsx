import { SyntheticEvent, useState } from "react"
import { Knight, LoginVM, Rank } from "../../../models"
import { base_GUID, base_URL } from "../../../Api/api"
import "./Authentication.css"
import { NavLink, useNavigate } from "react-router-dom"

const endPoint = "Account/"

export function Login() {
    const [user, setUser] = useState<LoginVM>({ UserName: "", Password: "", RememberMe: false })
    const [logMessage, setLogMessage] = useState<string>("");
    const navigate = useNavigate();

    async function LoginHandler() {
        const response = await fetch(base_URL + endPoint + "Login", { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(user) });
        if (response.ok) {
            navigate('/Tournament');
        }
        else {
            const data = await response.text();
            setLogMessage(data);
        }
    }

    return (
        <div className="dropdown-container">
            <label>Name: <input type="text" onChange={(e) => setUser({ ...user, UserName: e.target.value })} /></label>
            <label>Password: <input type="password" onChange={(e) => setUser({ ...user, Password: e.target.value })} /></label>
            <label><input type="checkbox" style={{width:'20px', display:'inline-block'}} defaultChecked={false} onChange={(e)=>setUser({...user, RememberMe: e.target.checked})} /><span style={{display:'inline-block'}}>Remember me</span> </label>
            <label className="log">{logMessage}</label>
            <div>
                <button className="btn btn-success" onClick={
                    () => LoginHandler()}>Login</button>
            </div>
        </div>
    );
}