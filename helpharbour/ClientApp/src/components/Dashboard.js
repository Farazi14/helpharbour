import React,  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Table } from 'reactstrap'; // Import the Table component from reactstrap
import { Container, Row, Col } from 'reactstrap'; 

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();

    // Use useEffect to handle redirection after the component has mounted
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/'); // Redirect to the login page if not logged in
            return;
        }
        console.log("User:", user);
        // implement the fetchTickets by user function on the frontend
        const fetchTickets = async () => {
            try {
                const response = await fetch(`/api/ticket/user/${user.userID}`, {
                    
                });
                if (response.ok) {
                    const data = await response.json();
                    setTickets(data);
                } else {
                    alert('Failed to fetch tickets.');
                }
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
                alert('Failed to fetch tickets due to an error.');
            }
        };

        fetchTickets();

    }, [isLoggedIn, navigate, user]);

    const handleTicketSelect = (ticketId) => {
        // Implement navigation to ticket details page
        console.log("Selected ticket ID:", ticketId);
        // For example, you could use navigate from `useNavigate` to go to a detailed view
        // navigate(`api/ticket/${ticketId}`);
    };

    const rowStyle = {
        border: '1px solid #dee2e6',
        padding: '0.5rem'
    };


    return (
        <div>
            <Container>
                <Row >
                    <Col>
                        <h1>Dashboard</h1>
                        <p>Welcome to the Dashboard,  <strong>{user?.username}</strong>!! You are logged as <strong>{user?.role}</strong> .</p>
                    </Col>
                </Row>
                <Row style={rowStyle}> 
                    <Col>
                    
                        <p>Charts display will go there!!</p>


                    </Col>   
                </Row>



                <Row  >
                    <Col >
                        <h2 >Ticket Table</h2>
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Urgency</th>
                                    <th>SLA Expiry</th>
                                    <th>Status</th>
                                    <th>Date Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket, index) => (
                                    <tr key={ticket.ticketID}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{ticket.title}</td>
                                        <td>{ticket.type}</td>
                                        <td>{ticket.description}</td>
                                        <td>{ticket.urgency}</td>
                                        <td>{new Date(ticket.slA_Expiry).toLocaleDateString()}</td>
                                        <td>{ticket.status}</td>
                                        <td>{new Date(ticket.createdDate).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleTicketSelect(ticket.ticketID)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
