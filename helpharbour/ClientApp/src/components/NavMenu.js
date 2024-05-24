import React, { useState } from 'react';                                                          // import the react library and the useState hook
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';      // import the Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, and NavLink components from the reactstrap library
import { Link } from 'react-router-dom';                                                          // import the Link component from the react-router-dom library
import logo from '../assets/logo.png';                                                            // import the logo image
import { useAuth } from '../context/AuthContext';                                                 // import the useAuth hook


const NavMenu = () => {
    const [collapsed, setCollapsed]         = useState(true);
    const { isLoggedIn, setLoggedIn, user } = useAuth();                                          // using the useAuth hook to set the isLoggedIn state and get the user details

    const toggleNavbar = () => {
        setCollapsed(!collapsed);                                                                 // Update the collapsed state for responsive navigation
    };

    const handleLogout = () => {
        setLoggedIn(false);                                                                       // Update the logged-in state
        
    };
    console.log("Navigation Bar User: ", user )

     // Navbar implementation with the use of the useAuth hook
    return (

        // Navbar implementation with the use of the useAuth hook, most of the implementation was set by default by the template
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
                                
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/createticket">Create Ticket</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/faq">FAQs</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/" onClick={handleLogout}>Logout</NavLink>
                                </NavItem>
                            </>
                        )}
                       
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
};

export default NavMenu;
