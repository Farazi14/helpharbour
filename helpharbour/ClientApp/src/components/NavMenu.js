/*import React, { Component } from 'react';*/
import React, { useState } from 'react'; // for sharing the state
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext'; // import the useAuth hook


const NavMenu = () => {
    const [collapsed, setCollapsed] = useState(true);
    const { isLoggedIn, setLoggedIn, user } = useAuth();       // using the useAuth hook

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = () => {
        setLoggedIn(false);  // Update the logged-in state
        
    };
    console.log("Navigation Bar User: ", user )

     // Navbar implementation with the use of the useAuth hook
    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light style={{ backgroundColor: '#43B1CB' }}>
                <NavbarBrand tag={Link} to="/"> <img src={logo} alt="HelpHarbour Logo" style={{ height: '50px' }} /></NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        {isLoggedIn && (
                            <>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/dashboard">Dashboard</NavLink>
                                </NavItem>

                                {/*conditionally render the Un-assigned Tickets link based on the user role*/}
                                {user && user.role === "administrator" && (
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/allticket">All Tickets</NavLink>
                                    </NavItem>
                                )}


                                {/*conditionally render the Assigned Tickets link based on the user role*/}
                                {user && user.role === "Technician" && (
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/assignedticket">Assigned Tickets</NavLink>
                                    </NavItem>
                                )}
                               
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/createticket">Create Ticket</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/profile">Profile</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/" onClick={handleLogout}>Logout</NavLink>
                                </NavItem>
                            </>
                        )}
                        {/*{!isLoggedIn && (*/}
                        {/*    <NavItem>*/}
                        {/*        <NavLink tag={Link} className="text-dark" to="/">Login</NavLink>*/}
                        {/*    </NavItem>*/}
                        {/*)}*/}
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
};

export default NavMenu;
