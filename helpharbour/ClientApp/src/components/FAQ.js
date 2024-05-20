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

        console.log('title: ', title, ' content: ', content);
       
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