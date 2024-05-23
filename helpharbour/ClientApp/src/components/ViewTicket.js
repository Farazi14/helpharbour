import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; //  Access route parameters here
import { Container, Row, Col, ListGroup, ListGroupItem, Form, FormGroup, Table, Input, Button, Label } from 'reactstrap';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook from the AuthContext to get the user details
import { useNavigate } from 'react-router-dom'; // navigate to login page if not logged in

const ViewTicket = () => {
    const [ticket, setTicket] = useState(null);
    const [assignedUserName, setAssignedUserName] = useState('');  // State to store the assigned user name
    const [comments, setComments] = useState([]);
    const { ticketId } = useParams();  // Access the ticketId parameter from the URL
    const [message, setMessage] = useState(''); // State to store the message to be posted
    const { isLoggedIn, user } = useAuth();  // Get the user details from the AuthContext
    const navigate = useNavigate();
    const [selectedAdmin, setSelectedAdmin] = useState(''); // State to store the selected admin for reassignment
    const [administrators, setAdministrators] = useState([]); // State to store the list of administrators
    const [selectedTech, setSelectedTech] = useState('');
    const [technicians, setTechnicians] = useState([]); // State to store the list of technicians

    const [isLoading, setIsLoading] = useState(true); // State to track loading state of admin list


    useEffect(() => {   // Fetch ticket details and comments when the component renders using useEffect
        if (!isLoggedIn) {
            navigate('/'); // Redirect to the home/login page if not logged in
        }


        // Fetch the user details for the assigned user
        const fetchUser = async (userId) => {
            if (!userId) return;
            const response = await fetch(`/api/useraccount/${userId}`);
            const userData = await response.json();
            if (response.ok) {

                setAssignedUserName(userData.username);
            } else {
                alert('Failed to fetch assigned user details');
            }
        };

        // Fetch the assigned user details in order to populate the assignedUserName state and display the name on the page
        const fetchTicketDetails = async () => {
            try {
                const response = await fetch(`/api/ticket/${ticketId}`);
                const data = await response.json();
                if (response.ok) {
                    setTicket(data);
                    fetchUser(data.assigned); // Fetch the assigned user details in order to display the name
                } else {
                    alert('Failed to fetch ticket details');
                }
            } catch (error) {
                console.error('Error fetching ticket details:', error);
                alert('An error occurred while fetching ticket details.');
            }
        };

       // Fetch comments for the ticket
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comment/ticket/${ticketId}`);   // Fetch comments for the ticket
                if (response.ok) {
                    const commentsData = await response.json();       // Parse the comments data
                    const commentsWithUserDetails = await Promise.all(commentsData.map(async (comment) => {  // Fetch user details for each comment using Promise.all
                        const userResponse = await fetch(`/api/useraccount/${comment.userID}`);    // Fetch user details for the comment author
                        const userData = await userResponse.json();    // Parse the user details
                        return {
                            ...comment,
                            author: userResponse.ok ? userData.username : 'Unknown'  // Set the author property to the username of the user who authored the comment
                        };
                    }));
                    setComments(commentsWithUserDetails);
                } else if (response.status === 404) {    
                    setComments([]);  // Set to an empty array if no comments found
                } else {
                    alert('Failed to fetch comments');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
                setComments([]);  // Set to an empty array in case of any network error
                alert('An error occurred while fetching comments.');
            }
        };

        // Fetch the list of administrators for reassignment
        const fetchAdministrators = async () => {
            setIsLoading(true);  // Set loading state to true before fetching the list of administrators
            const response = await fetch('/api/useraccount/admins');
            if (response.ok) {
                const admins = await response.json();
                
                setAdministrators(admins);
                setIsLoading(false); // Set loading state to false after fetching the list of administrators
            }
            
        };

        //fetch the list of technicians
            const fetchTechnicians = async () => {
            setIsLoading(true);  // Set loading state to true before fetching the list of technicians
            const response = await fetch('/api/useraccount/technicians');
            if (response.ok) {
                const techs = await response.json();
                
                setTechnicians(techs);
                setIsLoading(false); // Set loading state to false after fetching the list of technicians
            }
            
        };


        fetchTechnicians();
        fetchAdministrators();
        fetchTicketDetails();
        fetchComments();
    }, [ticketId, isLoggedIn, navigate]);         

    // Function to handle posting a new comment
    const handlePostMessage = async (event, action) => {
        event.preventDefault();  // Prevent the form from causing a page reload
        if (message.trim() === '') {     // Validate the message
            alert('Message cannot be empty.');
            return;
        }

        console.log("here: ", action)

        // API call to post the new comment
        const response = await fetch(`/api/comment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, userID: user.userID, ticketId })   // Send the message, user ID, and ticket ID in the request body
        });
        

        if (response.ok) {
            const newComment = await response.json();
            // Fetch the username for the user who posted the comment
            const userResponse = await fetch(`/api/useraccount/${user.userID}`); 
            const userData = await userResponse.json();
            const authorName = userResponse.ok ? userData.username : 'Unknown';  // Get the author's username

            // Include the author's username in the new comment before adding it to state
            const newCommentWithAuthor = {
                ...newComment,
                author: authorName  // Add author's name to the new comment
            };

            setComments([...comments, newCommentWithAuthor]);  // Update comments list with the new comment
            setMessage('');  // Clear the input after posting

        } else {
            alert('Failed to post message. Please try again.');
        }

        //here check if the resolve button is clicked, to make another api call to update the status of the ticket and then navigate to the assigned ticket page
        if (action === 'resolve') {
            // API call to resolve the ticket
            const resolveResponse = await fetch(`/api/ticket/${ticketId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Resolved' })  // Update the status to 'Resolved'
            });

            if (resolveResponse.ok) {
                alert('Ticket resolved successfully.');
                navigate('/dashboard');  // Redirects to the dashboard
            } else {
                alert('Failed to resolve ticket. Please try again.');
            }
        }

    };
    // Function to handle reassigning the ticket to a different administrator
    const handleReassign = async () => {
        console.log(selectedTech || selectedAdmin )
        try {
            const response = await fetch(`/api/ticket/${ticket.ticketID}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({
                    assigned: selectedAdmin || selectedTech, // send the selected admin or technician ID in the request body because both form inputs are calling the same function
                    status: "Assigned"    // As soon as the ticket is assigned or reassigned, the status would change to assigned so that the assignee would know that they have been assigned a ticket 
                }) 
            });

            if (response.ok) {
                if (user.role === 'Technician') { 
                alert('Ticket successfully reassigned.');
                    navigate('/dashboard');
                }
                if (user.role === 'administrator') {
                    alert('Ticket successfully assigned.');
                    navigate('/allticket');
                }
               
            } else {
                alert('Failed to reassign ticket. Please try again.');
            }
        } catch (error) {
            console.error('Error reassigning ticket:', error);
            alert('An error occurred while trying to reassign the ticket.');
        }
    };

    return (
        <Container>
            {/*Display ticket details in a vertical table*/}
            <Row>
                <Col>
                    <h1>Ticket Details</h1>
                    {ticket && (
                        <Table bordered>
                            <tbody>
                                <tr>
                                    <th>Title</th>
                                    <td>{ticket.title}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{ticket.description}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{ticket.status}</td>
                                </tr>
                                <tr>
                                    <th>Urgency</th>
                                    <td>{ticket.urgency}</td>
                                </tr>
                                <tr>
                                    <th>Assigned to</th>
                                    {/*if the ticket is not assigned to anyone, display "Not assigned" in the table cell*/}
                                    {assignedUserName ? (
                                        <td>{assignedUserName}</td>
                                    ) : ( <td>Not assigned</td> 
                                    )}
                                </tr>

                                {/*handle reassigning the ticket to an administrator, only if the user is a technician and the ticket is not resolved*/}
                                {user && user.role === 'Technician' && ticket && ticket.status !== 'Resolved' && (
                                    <tr>
                                        <th>Reassign</th>
                                        <td>
                                           {/* Display dropdown to select an administrator for ticket reassignment*/}
                                            <Form inline>
                                                <FormGroup>
                                                    <Label for="adminSelect" hidden>Select Admin</Label>
                                                    {/*Display a loading message while the list of administrators is being fetched*/}
                                                    {isLoading ? ( 
                                                        <Input type="select" name="admin" id="adminSelect" disabled>
                                                            <option>Loading...</option>
                                                        </Input>
                                                    ) : (
                                                            <Input type="select" name="admin" id="adminSelect" onChange={e => setSelectedAdmin(e.target.value)} value={selectedAdmin}> {/*Select an administrator from the dropdown and once onchange event is triggered, the selected admin will be set in the state*/}
                                                            <option value="">Select an Administrator</option>
                                                                {/*Display the list of administrators in the dropdown using map function*/}
                                                                {administrators.map((admin) => (
                                                                <option key={admin.userID} value={admin.userID}>{admin.username}</option>
                                                            ))}
                                                        </Input>
                                                    )}
                                                </FormGroup>
                                                {/*Display the reassign button only if an admin is selected*/}
                                                {selectedAdmin && (  
                                                    <Button color="primary" onClick={handleReassign}>Reassign</Button>
                                                )}
                                            </Form>
                                        </td>
                                    </tr>
                                )}

                                {/*ticket assignment to technician implementation*/}
                                {user && user.role === 'administrator' && (
                                    <tr>
                                        <th>Assign</th>
                                        <td>
                                            {/* Display dropdown to select an administrator for ticket reassignment*/}
                                            <Form inline>
                                                <FormGroup>
                                                    <Label for="TechnicianSelect" hidden>Select Technician</Label>
                                                    {/*Display a loading message while the list of administrators is being fetched*/}
                                                    {isLoading ? (
                                                        <Input type="select" name="technician" id="TechnicianSelect" disabled>
                                                            <option>Loading...</option>
                                                        </Input>
                                                    ) : (
                                                            <Input type="select" name="technician" id="TechnicianSelect" onChange={e => setSelectedTech(e.target.value)} value={selectedTech}> {/*Select a technician from the dropdown and once onchange event is triggered, the selected tech will be set in the state*/}
                                                            <option value="">Select a Technician</option>
                                                            {/*Display the list of technicians in the dropdown using map function*/}
                                                            {technicians.map((tech) => (
                                                                <option key={tech.userID} value={tech.userID}>{tech.username}</option>
                                                            ))}
                                                        </Input>
                                                    )}
                                                </FormGroup>
                                                {/*Display the reassign button only if an technician is selected*/}
                                                {selectedTech && (
                                                    /*Reusing handleReassign function to assign the ticket to the selected technician*/
                                                    <Button color="primary" onClick={handleReassign}>Assign</Button>
                                                )}
                                            </Form>
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </Table>
                    )}
                </Col>
                
            </Row>
            {/*Display comments*/}
            <Row>
                <Col className="mt-3">
                    <h2>Messages</h2>
                    {comments.length > 0 ? (   // Display comments if there are any
                        <ListGroup>
                            {comments.map(comment => (
                                <ListGroupItem key={comment.id}>
                                    <strong>{comment.author}</strong>:
                                    <p>{comment.message}</p>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No messages found.</p>  // Display a message if there are no comments
                    )}
                </Col>
            </Row>
            {/*Post message implementation*/}
             {/*Display the post button only if the ticket is not resolved*/}
            {ticket && ticket.status !== 'Resolved' && ( 
            <Row>
                <Col className=" mt-4 " >
                    <h2>Post Message</h2>
                    <Form onSubmit={handlePostMessage}>
                        <FormGroup >
                           
                            <Input
                                type="textarea"
                                name="message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Please write your message here..."
                            />
                        </FormGroup>

                        
                        <div className="text-end">  {/* This will align the button to the right */}
                            <Button style={{ marginRight: '1em' }}  type="submit" color="primary">Post</Button>

                            {/*Resolved button implementation*/}
                            {user && user.role !== "User" && (
                                <Button type="button" onClick={(e) => handlePostMessage(e, 'resolve')} color="success">Resolve</Button> 
                            )}
                            </div>
                        
                    </Form>
                      
                </Col>
                </Row>
            )}
        </Container>
    );
};

export default ViewTicket;
