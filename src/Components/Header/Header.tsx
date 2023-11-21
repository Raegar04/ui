import { relative } from "path";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

const Header = ()=>{
return (
    <Fragment>
        <div className="d-flex justify-content-center">
            <NavLink style={{textDecoration:'none', color:'black'}} to='/Tournament' id="baseLink">
                <h1 style={{margin:'40px'}}><img style={{width:'40px', marginRight:'10px', position:'relative', top:'-5px'}} src="https://cdn-icons-png.flaticon.com/128/3917/3917565.png"/>Welcome to Knight Tournaments manager</h1><br/>
            </NavLink>
        </div>
    </Fragment>
);
}

export default Header;