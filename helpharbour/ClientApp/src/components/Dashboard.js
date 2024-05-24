import React from 'react';
import { useNavigate } from 'react-router-dom';   // Importing useNavigate hook from react-router-dom
import { useAuth } from '../context/AuthContext'; // Importing useAuth hook from AuthContext
import { Container, Row, Col } from 'reactstrap'; // Importing Container, Row, Col components from reactstrap
import AssignedTickets from './AssignedTickets';  // Importing  AssignedTickets component
import MyTicket from './MyTicket';                // Importing MyTicket component


const Dashboard = () => {
   
    const navigate = useNavigate();  // Define the navigate function for redirecting to login page
    const {user }  = useAuth();      // storing user details in the user variable
       
    if (!user) {
        navigate('/'); // Redirect to the login page if not logged in
        return;
    }
    
    return (
        <div>
            <Container>
                <Row >
                    <Col>
                        <h1>Dashboard</h1>
                        <p>Welcome to the Dashboard,  <strong>{user?.username}</strong>!! You are logged as <strong>{user?.role}</strong> .</p>
                    </Col>
                </Row>
                <Row> 
                    <Col>
                        <p>Charts display will go there!!</p>
                    </Col>   
                </Row>
                {/* Displaying MyTicket component */}
                <Row>
                    <Col>
                        <MyTicket />
                    </Col>
                </Row>

                {/* Display the AssignedTickets component */}
                {user.role !== "User" && (
                <Row>
                    <Col>
                           <AssignedTickets /> 
                    </Col>
                </Row>
                )}

            </Container>
        </div>
    );
};

export default Dashboard;
