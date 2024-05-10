import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, FormGroup, Label, Input  } from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const AllTickets = () => {
    const [tickets, setTickets] = useState([]); // Define the state variable for storing the tickets
    const navigate = useNavigate();     // Define the navigate function for redirecting to login page
    const [selectedStatus, setSelectedStatus] = useState('');       // Define the state variable for storing the selected status after it is selected from the dropdown menu
    const [statuses, setStatuses] = useState([]);       // store the unique statuses in the statuses variable
    const { isLoggedIn, user } = useAuth();    // storing user details in the user variable

    // Implement the useEffect hook to fetch the status of tickets
    useEffect(() => {

        if (!isLoggedIn) {
            navigate('/'); // Redirect to the login page if not logged in
            return;
        }
        // Implement the fetchTickets API to fetch the tickets
        const fetchStatus = async () => {
            
            const response = await fetch('/api/ticket/allstatus');   //API call to get all statuses   

            if (response.ok) {
                const statuses = await response.json();   // Get the statuses from the response
                
                setStatuses(statuses); // Set unique statuses
            } else {
                alert('Failed to fetch ticket status.');
            }           
        };

        fetchStatus(); // Call the fetchTickets function
    }, []);


    const handleStatusChange = async (event) => {
        const selectedStatus = event.target.value;
        setSelectedStatus(selectedStatus); // Update the selected status state

        if (selectedStatus) {
            try {
                const response = await fetch(`/api/ticket/bystatus/${selectedStatus}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTickets(data); // Assuming the response contains an array of tickets
                } else {
                    console.error("Failed to fetch tickets by status");
                    alert("Failed to fetch tickets by status.");
                    setTickets([]); // Clear tickets if the fetch fails
                }
            } catch (error) {
                console.error("Error fetching tickets by status:", error);
                alert("An error occurred while fetching tickets.");
                setTickets([]); // Clear tickets on error
            }
        } else {
            setTickets([]); // Optionally clear tickets if no status is selected
        }
        
    }

    const handleTicketSelect = (ticketId) => {
        // Implement navigation to ticket details page
        console.log("Selected ticket ID:", ticketId);
        navigate(`/viewticket/${ticketId}`);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <p>Please use the following dropdown menu to view the ticket by status:</p>
                    <Form>
                        <FormGroup> {/* Implementing the form group for the status filter so that the user can select the status*/}
                            <Label for="statusFilter">Filter by Status:</Label>
                            <Input type="select" name="status" id="statusFilter" onChange={handleStatusChange} value={selectedStatus}>  {/* Implementing the dropdown menu for the status filter and calling handleStatusChange function on change to the dropdownmenu  */}
                                <option value="">Select a Status</option>
                                {statuses.map(status => (   // Mapping the received statuses to the dropdown menu
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

                                            <Button color="primary" onClick={() => handleTicketSelect(ticket.ticketID)}>View</Button>

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