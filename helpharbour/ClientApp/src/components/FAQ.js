import React, { useState, useEffect  } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom'


const FAQ = () => {

    const [faqs, setFaqs] = useState([]);
    const { isLoggedIn, user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

     useEffect(() => {
        if (!isLoggedIn) {
            navigate('/'); // Redirect to the login page if not logged in
            return;
        }
        

        // Implement the Fetchfaqs function to fetch the FAQs to get all the FAQs data
        const fetchFaqs = async () => {
            try {
                const response = await fetch('/api/faq');
                if (response.ok) {
                    const data = await response.json();
                    const formattedFaqs = data.map(faq => ({ ...faq, isOpen: false }));
                    setFaqs(formattedFaqs);
                } else {
                    alert('Failed to fetch FAQs');
                }
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
                alert('Failed to fetch FAQs due to an error.');
            }
        }

        fetchFaqs(); // Call the Fetchfaqs function
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
                 
        try {
            const response = await fetch('/api/faq/addfaq', {  // fetch the API to add the FAQ
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, authorID: user.userID })  // JSON payload to be sent to the server
            });

            if (response.ok) {
                const newFaq = await response.json();
                // implementation to display to newly added FAQ in the list of FAQs so that it is visible to the user without refreshing the page
                setFaqs([...faqs, { ...newFaq, isOpen: false }]);
                setTitle('');
                setContent('');
                alert('FAQ added successfully!'); // Display the alert message when the FAQ is added successfully
            } else {
                alert('Failed to add FAQ');     // Display the alert message when the FAQ is not added successfully
            }
        } catch (error) {
            console.error('Failed to add FAQ:', error);
            alert('An error occurred while adding the FAQ.'); // Display the alert message when an error occurs while adding the FAQ
        }
       
    };

    const handleDelete = async (articleID) => {
        console.log("Delete articleID:", articleID);
        
    }

    const toggleFaq = index => {
        setFaqs(currentFaqs =>
            currentFaqs.map((faq, i) => {
                if (i === index) {
                    
                    return { ...faq, isOpen: !faq.isOpen };
                }
                return faq;
            })
        );
    };

    return (
        <Container>
            {user.role === "administrator" && (
                <Row>
                    <Col >
                        <Form onSubmit={handleSubmit}> {/*on submit of the form, the handleSubmit function is called*/}
                            <FormGroup>
                                <Label for="faqTitle">Title</Label>
                                {/* enter the title of the FAQ*/}
                                <Input
                                    id="faqTitle"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Enter FAQ title"
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                {/* enter the content of the FAQ*/ }
                                <Label for="faqContent">Content</Label>
                                <Input
                                    type="textarea"
                                    id="faqContent"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Enter FAQ content"
                                    required
                                />
                            </FormGroup>
                            <Button style={{ float: 'right' }} type="submit" color="primary">Add FAQ</Button>
                        </Form>

                    </Col>
                </Row>
            )}

            <Row className= "mt-4">
                <Col className="text-center">
                    <h1>Frequently Asked Questions</h1>
                    {/* Display the FAQs in a list and toggle the content when the user clicks on the FAQ*/}
                    {faqs.length > 0 ?  
                    (faqs.map((faq, index) => (
                        <div key={faq.articleID} className="my-3">
                            <Button onClick={() => toggleFaq(index)} style={{ width: '100%', textAlign: 'left', backgroundColor : '#43B1CB' }}>
                                {faq.title}
                                <span style={{ float: 'right' }}> 
                                    {/*implementation to display the delete button only for the administrator*/}
                                    {user.role === "administrator" && (
                                        <Button color="danger" onClick={() => handleDelete(faq.articleID)} style={{ margin: '10px' }}>Delete</Button>
                                    )} {/*implementation to display the delete button only for the administrator ends here*/}
                                    {faq.isOpen ? 'v' : '>'}</span>  {/*Display the arrow icon v when faq is open and > when it is closed*/}
                            </Button>
                            {/* Display the content of the FAQ when it is open*/}
                            {faq.isOpen && (
                                <p style={{ textAlign: 'left' }} >{faq.content}</p>  
                            )}
                        </div>
                    ))
                    ): ("Loading")}  {/*else display loading*/}
                </Col>
            </Row>
        </Container>
    );
}

export default FAQ;