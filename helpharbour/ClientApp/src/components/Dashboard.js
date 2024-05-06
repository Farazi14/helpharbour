import React,  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Table } from 'reactstrap'; // Import the Table component from reactstrap
import { Container, Row, Col, Button } from 'reactstrap'; 

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
        
        navigate(`/viewticket/${ticketId}`);
    };

    const rowStyle = {
        border: '1px solid #dee2e6',
        padding: '0.5rem'
    };

    // Implement the handleTicketStatus function
    const handleTicketStatus = async (ticketID, newStatus) => {

        console.log("Ticket ID:", ticketID, " Status ", newStatus);
        const response = await fetch(`/api/ticket/${ticketID}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({ status: newStatus })
        });

        console.log(response.status);
        if (response.ok) {
            const updatedTicket = await response.json();  // Parse the updated ticket data for frontend rendering
            // Update the ticket state to reflect the change in the UI
            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.ticketID === ticketID ? { ...ticket, status: updatedTicket.status } : ticket  // Update the status of the ticket with the new status
                )
            );
            // Display a success message to the user
            if (updatedTicket.status === "Close") {
                alert('Ticket closed successfully');
            // Implement a success message for reopening a ticket
            } else if (updatedTicket.status === "Open") {
                alert('Ticket reopened successfully');
            }
        } else {
            alert(response.status + ' Update failed');
        }
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
                                            
                                            <Button color="primary" onClick={() => handleTicketSelect(ticket.ticketID)}>View</Button>

                                            {ticket.status === "Resolved" && (
                                                <Button className="ml-2" color="danger" onClick={() => handleTicketStatus(ticket.ticketID, "Close")}>Close</Button>
                                            )}

                                            {ticket.status === "Close" && (
                                                <Button className="ml-2" color="success" onClick={() => handleTicketStatus(ticket.ticketID, "Open")}>Reopen</Button>
                                            )}
                                           
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
