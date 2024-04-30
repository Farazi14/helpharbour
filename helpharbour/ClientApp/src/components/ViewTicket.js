import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; //  Access route parameters here
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';

const ViewTicket = () => {
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const { ticketId } = useParams();  // Access the ticketId parameter from the URL

    console.log(`${ticketId}`);

    useEffect(() => {   // Fetch ticket details and comments when the component renders using useEffect
        const fetchTicketDetails = async () => {
            try {
                const response = await fetch(`/api/ticket/${ticketId}`);
                const data = await response.json();
                if (response.ok) {
                    setTicket(data);
                } else {
                    alert('Failed to fetch ticket details');
                }
            } catch (error) {
                console.error('Error fetching ticket details:', error);
                alert('An error occurred while fetching ticket details.');
            }
        };

        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comments/ticket/${ticketId}`);
                const data = await response.json();
                if (response.ok) {
                    setComments(data);
                } else {
                    alert('Failed to fetch comments');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
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
                            <p>Title</p>
                            <h2>{ticket.title}</h2>
                            <p>{ticket.description}</p>
                            <p>Status: {ticket.status}</p>
                            <p>Urgency: {ticket.urgency}</p>
                            <p>Assigned to: {ticket.assigned}</p>
                        </div>
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Comments</h2>
                    <ListGroup>
                        {comments.map(comment => (
                            <ListGroupItem key={comment.id}>
                                {comment.author}: {comment.message}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default ViewTicket;
