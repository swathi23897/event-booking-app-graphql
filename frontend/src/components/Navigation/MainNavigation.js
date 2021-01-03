
import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavigation.css'   //webpack sees the import and injects the css code - it is not scoped -- it is global 
import AuthContext from '../../context/auth-context'
const mainNavigation = props => (
   
    <AuthContext.Consumer>
        {(context) => {
             
            return (

                <header className="main-navigation">
                    <div className="main-navigation__logo">

                        <h1>EasyEvent</h1>

                    </div>
                    <nav className="main-navigation__items">

                        <ul>
                            {
                                !context.token &&
                                <li>
                                    <NavLink to="/auth">Authenticate</NavLink>
                                </li>
                            }


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

                            )



                            }

                        </ul>
                    </nav>
                </header>
            )

        }}

    </AuthContext.Consumer>

)


export default mainNavigation;