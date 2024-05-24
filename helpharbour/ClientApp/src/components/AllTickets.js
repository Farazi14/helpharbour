import React, { useState, useEffect } from 'react';                                                 // Importing react, useState and useEffect
import { Container, Row, Col, Table, Button, Form, FormGroup, Label, Input  } from 'reactstrap';    // Importing Container, Row, Col, Table, Button, Form, FormGroup, Label, Input from reactstrap
import { useAuth } from '../context/AuthContext';                                                   // Importing useAuth from AuthContext
import { useNavigate } from 'react-router-dom';                                                     // Importing useNavigate from react-router-dom


const AllTickets = () => {
    const [tickets, setTickets]               = useState([]);                                       // Define the state variable for storing the tickets
    const navigate                            = useNavigate();                                      // Define the navigate function for redirecting to login page
    const [selectedStatus, setSelectedStatus] = useState('');                                       // Define the state variable for storing the selected status after it is selected from the dropdown menu
    const [statuses, setStatuses]             = useState([]);                                       // store the unique statuses in the statuses variable
    const {user }                             = useAuth();                                          // storing user details in the user variable

    // Implement the useEffect hook to fetch the status of tickets
    useEffect(() => {
        // Redirect to the login page if not logged in
        if (!user) {
            navigate('/'); 
            return;
        }

        // Implement the fetchTickets API to fetch the tickets
        const fetchStatus = async () => {
            
            const response = await fetch('/api/ticket/allstatus');                                  //API call to get all statuses   

            if (response.ok) {
                const statuses = await response.json();                                             // Get the statuses from the response
                
                setStatuses(statuses);                                                              // Set unique statuses
            } else {
                alert('Failed to fetch ticket status.');
            }           
        };

        fetchStatus();                                                                              // Call the fetchTickets function
    }, []);


    const handleStatusChange = async (event) => {
        const selectedStatus = event.target.value;                                                  // Get the selected status from the dropdown menu
        setSelectedStatus(selectedStatus);                                                          // Update the selected status state

        if (selectedStatus) {
            try {
                //API call to get the tickets by status
                const response = await fetch(`/api/ticket/bystatus/${selectedStatus}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTickets(data); 
                } else {
                    console.error("Failed to fetch tickets by status");
                    alert("Failed to fetch tickets by status.");
                    setTickets([]);                                                                 // Clear tickets if the fetch fails
                }
            } catch (error) {
                console.error("Error fetching tickets by status:", error);
                alert("An error occurred while fetching tickets.");
                setTickets([]);                                                                     // Clear tickets on error
            }
        } else {
            setTickets([]);                                                                         // Optionally clear tickets if no status is selected
        }
        
    }

    const handleTicketSelect = (ticketId) => {
        navigate(`/viewticket/${ticketId}`);
    };

    const handleDeleteTicket = async (ticketId) => {
        // Implement the delete ticket functionality
        // API call to delete the ticket
        try {
            const response = await fetch(`/api/ticket/${ticketId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                alert('Ticket deleted successfully.');                                              // Display success message
                const updatedTickets = tickets.filter(ticket => ticket.ticketID !== ticketId);      // Filter out the deleted ticket
                setTickets(updatedTickets);                                                         // Update the tickets state
            } else {
                alert('Failed to delete ticket.');
            }
        } catch (error) {
            console.error('Failed to delete ticket:', error);
            alert('Failed to delete ticket. Please try again.');
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <strong><p>Please use the following dropdown menu to view the ticket by status:</p></strong>
                    <Form>
                        <FormGroup>                                                                                                     {/* Implementing the form group for the status filter so that the user can select the status*/}
                            <Label for="statusFilter">Filter by Status:</Label>
                            <Input type="select" name="status" id="statusFilter" onChange={handleStatusChange} value={selectedStatus}>  {/* Implementing the dropdown menu for the status filter and calling handleStatusChange function on change to the dropdownmenu  */}
                                <option value="">Select a Status</option>
                                {statuses.map(status => (                                                                               // Mapping the received statuses to the dropdown menu
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>

            {/*Table display implementation below, the implementation is copied from dashboard.js file*/}
            <Row className="mt-4">
                <Col>
                    <h5>View Tickets</h5>
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
                                             {/*Display delete button for unassigned ticket as they may not be a valid ticket*/}
                                             {ticket.status === "Unassigned" && (
                                                <Button color="danger" onClick={() => handleDeleteTicket(ticket.ticketID)} >Delete</Button>
                                            )}

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                /* Display a message if there are no tickets*/
                                <tr>
                                    <td colSpan="9" className="text-center">No tickets to display</td>
                                </tr>
                            )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

export default AllTickets;