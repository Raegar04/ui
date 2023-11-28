import { useEffect, useState } from "react";
import { Knight, Rank } from "../../../models";
import { base_GUID, base_URL } from "../../../Api/api";
import { NavLink } from "react-router-dom";
import "../Account.css"


const REGEX_Credentials = /[a-zA-Z0-9-_]{4,23}/;
const REGEX_EMAIL = /[a-z0-9-_]{6,30}@gmail.com/;
const endPoint = "Account/"

export function Register() {
    const [user, setUser] = useState<Knight>({ Id: base_GUID, Rank: Rank.Ritter, UserName: "", Email: "", Rating: 0, Password: "", ConfirmPassword: "" })

    const [validName, setValidName] = useState(false);
    const [nameFocused, setNameFocused] = useState(false);

    const [validEmail, setValidEmail] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);

    const [validPassword, setValidPassword] = useState(false);
    const [passFocused, setPassFocused] = useState(false);

    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

    const [logMessage, setLogMessage] = useState<string>("");

    useEffect(()=>{
        setValidName(REGEX_Credentials.test(user.UserName));
        setValidEmail(REGEX_EMAIL.test(user.Email));
        setValidPassword(REGEX_Credentials.test(user.Password));
    },[user.UserName, user.Password]);

    useEffect(()=>{
        setValidConfirmPassword(REGEX_Credentials.test(user.ConfirmPassword) && user.ConfirmPassword === user.Password);
    },[user.Password, user.ConfirmPassword]);

    // async function RegisterHandler() {
    //     const response = await fetch(base_URL + endPoint + "Register", { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(user) });
    //     const data = await response.text();
    //     setLogMessage(data);
    //     if (response.ok) {
    //         return <NavLink to="/Tournament" />;
    //     }
    // }

    return (
        <div className="dropdown-container">
            <label>Username:{validName? <span style={{color:'green'}}>Valid</span> : <span style={{color:'red'}}>Invalid</span>}
                <input 
                type="text" 
                autoComplete="off"
                required
                // aria-invalid={validName ? "false" : "true"}
                onChange={(e) => setUser({ ...user, UserName: e.target.value })}
                onFocus={()=>setNameFocused(true)} 
                onBlur={()=>setNameFocused(false)}/>
                {nameFocused ? <span className="validation-rules">4 to 24 characters <br />Letters in all registers and numbers are allowed</span> : null}
            </label>

            <label>Email:{validEmail? <span style={{color:'green'}}>Valid</span> : <span style={{color:'red'}}>Invalid</span>}
                <input 
                type="text" 
                autoComplete="off"
                required
                // aria-invalid={validName ? "false" : "true"}
                onChange={(e) => setUser({ ...user, Email: e.target.value })}
                onFocus={()=>setEmailFocused(true)} 
                onBlur={()=>setEmailFocused(false)}/>
                {emailFocused ? <span className="validation-rules">6 to 30 characters <br />Should follow standarts</span> : null}
            </label>
            
            <label>Password:{validPassword? <span style={{color:'green'}}>Valid</span> : <span style={{color:'red'}}>Invalid</span>}
                <input 
                type="password" 
                autoComplete="off"
                required
                // aria-invalid={validPassword ? "false" : "true"}
                onChange={(e) => setUser({ ...user, Password: e.target.value })}
                onFocus={()=>setPassFocused(true)} 
                onBlur={()=>setPassFocused(false)}/>
                {passFocused ? <p className="validation-rules">4 to 24 characters <br />Letters in all registers and numbers are allowed</p> : null}
            </label>

            <label>Confirm Password:{validConfirmPassword? <span style={{color:'green'}}>Valid</span> : <span style={{color:'red'}}>Invalid</span>}
                <input 
                type="password" 
                autoComplete="off"
                required
                // aria-invalid={validConfirmPassword ? "false" : "true"}
                onChange={(e) => setUser({ ...user, ConfirmPassword: e.target.value })}
                onFocus={()=>setConfirmPasswordFocused(true)} 
                onBlur={()=>setConfirmPasswordFocused(false)}/>
                {confirmPasswordFocused ? <p className="validation-rules">4 to 24 characters <br />Letters in all registers and numbers are allowed</p> : null}
            </label>
            {/* <label>
                <select onChange={(e) => setUser({ ...user, Rank: Rank[e.target.value as keyof typeof Rank] })}>
                    <option >Select your Rank</option>
                    <option value={Rank.Ritter}>Ritter</option>
                    <option value={Rank.Banegraph}>Banegraph</option>
                    <option value={Rank.Master}>Master</option>
                    <option value={Rank.Supreme}>Supreme</option>
                    <option value={Rank.Lord}>Lord</option>
                </select>
            </label>
            <label>Rating: <input type="number" onChange={(e) => setUser({ ...user, Rating: e.target.valueAsNumber })} /></label> */}
            {logMessage!==""?<label className="log">{logMessage}</label>:null}
            
            <div>
                <label><button className="btn btn-success" type="button">Register</button></label>
<button className="btn btn-link" type="button">Sign in</button>
            
            </div>
        </div>
    );
}

export default Register;