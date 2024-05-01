import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; //  Access route parameters here
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';

const ViewTicket = () => {
    const [ticket, setTicket] = useState(null);
    const [assignedUserName, setAssignedUserName] = useState('');  // State to store the assigned user name
    const [comments, setComments] = useState([]);
    const { ticketId } = useParams();  // Access the ticketId parameter from the URL



    useEffect(() => {   // Fetch ticket details and comments when the component renders using useEffect

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

        fetchTicketDetails();
        fetchComments();
    }, [ticketId]); 

    return (
        <Container>
            <Row>
                <Col>
                    <h1>Ticket Details</h1>
                    {ticket && (
                        <div>
                            <h2>Title</h2>
                            <p>{ticket.title}</p>
                            <p>{ticket.description}</p>
                            <p>Status: {ticket.status}</p>
                            <p>Urgency: {ticket.urgency}</p>
                            <p>Assigned to: {assignedUserName || 'Loading...'}</p>
                        </div>
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Messages</h2>
                    {comments.length > 0 ? (   // Display comments if there are any
                        <ListGroup>
                            {comments.map(comment => (
                                <ListGroupItem key={comment.id}>
                                    {comment.author}:
                                    <p>{comment.message}</p>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No messages found.</p>  // Display a message if there are no comments
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ViewTicket;
