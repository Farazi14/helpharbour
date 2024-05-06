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


        fetchAdministrators();
        fetchTicketDetails();
        fetchComments();
    }, [ticketId, isLoggedIn, navigate]);         

    // Function to handle posting a new comment
    const handlePostMessage = async (event) => {
        event.preventDefault();  // Prevent the form from causing a page reload
        if (message.trim() === '') {     // Validate the message
            alert('Message cannot be empty.');
            return;
        }

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
    };
    // Function to handle reassigning the ticket to a different administrator
    const handleReassign = async () => {
        console.log(selectedAdmin)
        try {
            const response = await fetch(`/api/ticket/${ticket.ticketID}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({ assigned: selectedAdmin })
            });

            if (response.ok) {
                alert('Ticket successfully reassigned.');
                navigate('/assignedticket');
               
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
                                    <td>{assignedUserName || 'Loading...'}</td>
                                </tr>
                                {user && user.role === 'Technician' && (
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
                            <Button type="submit" color="primary">Post</Button>
                        </div>
                    </Form>
                      
                </Col>
            </Row>
        </Container>
    );
};

export default ViewTicket;
