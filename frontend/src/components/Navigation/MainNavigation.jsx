import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import './MainNavigation.css';

const MainNavigation = props => {
    return (
        <AuthContext.Consumer>
            {(context) => (
                <header className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1>EasyEvent</h1>
                    </div>
                    <nav className="main-navigation__items">
                        <ul>
                            <li>
                                <NavLink to="/events">Events</NavLink>
                            </li>
                            {context.token && (
                                <React.Fragment>
                                <li>
                                    <NavLink to="/bookings">Bookings</NavLink>
                                </li>
                                <li>
                                    <button onClick={context.logout}>Logout</button>
                                </li>
                                </React.Fragment>     
                            )}
                            {!context.token && (
                                <li>
                                    <NavLink to="/auth">Authentication</NavLink>
                                </li>
                            )}
                        </ul>
                    </nav>
                </header>
            )}
        </AuthContext.Consumer>
    );
}

export default MainNavigation;
