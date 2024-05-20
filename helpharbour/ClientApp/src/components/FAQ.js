import React, { useState, useEffect  } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useAuth } from '../context/AuthContext';


const FAQ = () => {

    const [faqs, setFaqs] = useState([]);
    const { isLoggedIn, user } = useAuth();

    useEffect(() => {
        

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
                        <p>Adding FAQ implementation here</p>

                    </Col>
                </Row>
            )}

            <Row>
                <Col className="text-center">
                    <h1>Frequently Asked Questions</h1>
                    {faqs.length > 0 ?  
                    (faqs.map((faq, index) => (
                        <div key={faq.articleID} className="my-3">
                            <Button onClick={() => toggleFaq(index)} style={{ width: '100%', textAlign: 'left', backgroundColor : '#43B1CB' }}>
                                {faq.title}
                                <span style={{ float: 'right' }}>{faq.isOpen ? 'v' : '>'}</span>
                            </Button>
                            {faq.isOpen && (
                                <p style={{ textAlign: 'left' }} >{faq.content}</p>
                            )}
                        </div>
                    ))
                    ): ("Loading")}
                </Col>
            </Row>
        </Container>
    );
}

export default FAQ;