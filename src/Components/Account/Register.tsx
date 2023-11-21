import { SyntheticEvent, useState } from "react"
import { Knight, LoginVM, Rank } from "../../models"
import { base_GUID, base_URL } from "../../Api/api"
import "../TablesStyles.css"
import { NavLink, useNavigate } from "react-router-dom"

const endPoint = "Account/"

export function ShowAuthChoices() {
    return (
        <div className="dropdown-container">
            <p>Select option:</p>
            <div style={{ display: "flex", margin: "auto" }}>
                <NavLink to='/Register' className="btn btn-info">Register</NavLink>
                <NavLink to='/Login' className="btn btn-info">Log in</NavLink>
            </div>
        </div>
    );
}

export function Register() {
    const [user, setUser] = useState<Knight>({ Id: base_GUID, Rank: Rank.Ritter, UserName: "", Email: "", Rating: 0, Password: "", ConfirmPassword: "" })
    const [logMessage, setLogMessage] = useState<string>("");

    async function RegisterHandler() {
        const response = await fetch(base_URL + endPoint + "Register", { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(user) });
        const data = await response.text();
        setLogMessage(data);
        if (response.ok) {
            return <NavLink to="/Tournament" />;
        }
    }

    return (
        <div className="dropdown-container">
            <label>Name: <input type="text" onChange={(e) => setUser({ ...user, UserName: e.target.value })} /></label>
            <label>
                <select onChange={(e) => setUser({ ...user, Rank: Rank[e.target.value as keyof typeof Rank] })}>
                    <option >Select your Rank</option>
                    <option value={Rank.Ritter}>Ritter</option>
                    <option value={Rank.Banegraph}>Banegraph</option>
                    <option value={Rank.Master}>Master</option>
                    <option value={Rank.Supreme}>Supreme</option>
                    <option value={Rank.Lord}>Lord</option>
                </select>
            </label>
            <label>Rating: <input type="number" onChange={(e) => setUser({ ...user, Rating: e.target.valueAsNumber })} /></label>
            <label>Password: <input type="password" onChange={(e) => setUser({ ...user, Password: e.target.value, ConfirmPassword: e.target.value })} /></label>
            <label className="log">{logMessage}</label>
            <div>
                <button className="btn btn-success" type="button" onClick={
                    () => RegisterHandler()}>Register</button>
            </div>
        </div>
    );
}

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
            <label className="log">{logMessage}</label>
            <div>
                <button className="btn btn-success" onClick={
                    () => LoginHandler()}>Login</button>
            </div>
        </div>
    );
}