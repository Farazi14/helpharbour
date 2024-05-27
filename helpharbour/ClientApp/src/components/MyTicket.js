import React, { useState, useEffect } from 'react';       // Import the useState and useEffect hooks from React
import { Table, Button, Container } from 'reactstrap';    // Import the Table, Button, and Container components from the Reactstrap library
import { useNavigate } from 'react-router-dom';           // Import the useNavigate hook from the React Router DOM library to navigate to different routes such as the ticket details page
import { useAuth } from '../context/AuthContext';         // Import the useAuth hook from the AuthContext to access the user details and authentication status

const MyTicket = () => {
    // Defining the state variables
    const [tickets, setTickets] = useState([]);          
    const navigate              = useNavigate();                       
    const user                  = useAuth().user;                         
    
     // Implement the useEffect hook to fetch the tickets when the component is mounted
    useEffect(() => {                                    
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
    });


    const handleTicketSelect = (ticketId) => {
        navigate(`/viewticket/${ticketId}`);                                                             // Navigate to the ticket details page with the selected ticket ID
    };

    // Implement the handleTicketStatus function
    const handleTicketStatus = async (ticketID, newStatus) => {               
        const response = await fetch(`/api/ticket/${ticketID}/status`, {                                 // API call to update the ticket status
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ status: newStatus })                                                  // Sending the new status in the request body
        });

        console.log(response.status);
        if (response.ok) {
            const updatedTicket = await response.json();                                                 // Parse the updated ticket data for frontend rendering
            // Update the ticket state to reflect the change in the UI
            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.ticketID === ticketID ? { ...ticket, status: updatedTicket.status } : ticket  
                )
            );
            if (updatedTicket.status === "Close") {                                                     // Display a success message to the user
                alert('Ticket closed successfully');
            } else if (updatedTicket.status === "Open") {                                               // Implement a success message for reopening a ticket
                alert('Ticket reopened successfully');
            }
        } else {
            alert(response.status + ' Update failed');
        }
    };

    return (    
        <Container>
               <h3>My Tickets</h3>
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
                            {/*Display the tickets in a table if there are any tickets*/}
                            {tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.ticketID}>
                                        <th scope="row">{ticket.ticketID}</th>
                                        <td>{ticket.title}</td>
                                        <td>{ticket.type}</td>
                                        <td>{ticket.description}</td>
                                        <td>{ticket.urgency}</td>
                                        <td>{new Date(ticket.slA_Expiry).toLocaleDateString()}</td>
                                        <td>{ticket.status}</td>
                                        <td>{new Date(ticket.createdDate).toLocaleDateString()}</td>
                                        <td>
                                            <p><Button color="primary" onClick={() => handleTicketSelect(ticket.ticketID)}>View</Button></p>

                                            {/*Display the close button for resolved tickets conditionally*/}
                                            {ticket.status === "Resolved" && (
                                                <Button className="mt-1" color="danger" onClick={() => handleTicketStatus(ticket.ticketID, "Close")}>Close</Button>
                                            )}
                                            {ticket.status === "Close" && (
                                                <Button className="mt-1" color="success" onClick={() => handleTicketStatus(ticket.ticketID, "Open")}>Reopen</Button>
                                            )}

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                /* Display a message if there are no tickets*/
                                <tr>
                                    <td colSpan="9" className="text-center">No tickets found</td>
                                </tr>
                            )
                            }
                        </tbody>
                </Table>
        </Container>           
            
    );
};


export default MyTicket;