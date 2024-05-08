import React,  { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import './NavMenu.css';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useAuth } from '../context/AuthContext';


const CreateTicket = () => {
    // define the state variables
    const [type, setType] = useState('');
    const [urgency, setUrgency] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [charCount, setCharCount] = useState(0);  // Added a charCount state to track the number of characters in the description field
    const [touched, setTouched] = useState({  // Added a touched state to track the fields that have been touched
        type: false,
        urgency: false,
        title: false,
        description: false
    });
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();  // Get the user details from the AuthContext

    // login validation
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/'); // Redirect to the home/login page if not logged in
        }
    }, [isLoggedIn, navigate]);
    

    // Implement the isFormValid function to check if the form is valid upon submission using state variables
    const isFormValid = () => {
        return (
            type !== '' &&
            urgency !== '' &&
            title.trim() !== '' && title.length <= 250 &&
            description.trim() !== '' && description.length <= 2500
        );
    };

    // Implement the validateInput function to validate the input fields
    const validateInput = (value, limit) => {
        if (value.length > limit) {
            return `The maximum character limit of ${limit} has been exceeded.`;
        }
        if (value.trim() === '') {
            return 'This field is required.';
        }
        return '';
    };
    
    // Implement the handleBlur function to track the fields that have been touched
    const handleBlur = (field) => () => {
        setTouched({ ...touched, [field]: true });  // Update the touched state
    };

    // Implement the event handlers for the form fields so that the state is updated when the user interacts with the form
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };
    // Implement the event handlers for the form fields so that the state is updated when the user interacts with the form
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setCharCount(e.target.value.length);
    };
    // form reset implementation to reset the form fields and state
    const handleReset = () => {
        setType('');
        setUrgency('');
        setTitle('');
        setDescription('');
        setCharCount(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if the form is valid before submitting
        if (!isFormValid()) {
            alert('Please fill all required fields correctly.');
            return;
        }

        // Create a ticketData object with the form data
        const ticketData = {
            type: type,
            urgency: urgency,
            title: title,
            description: description,
            Requestor: `${user.userID}`, // Add the username of the logged-in user as the Requestor
            assigned: "", // Add the assigned field with a default value of "Unassigned"
            status: "Un-assigned" // Add the status of the newly created ticket
        };
        console.log("here ", ticketData);
        // Implementing the API call to submit the form data
        try {
            const response = await fetch('/api/ticket', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify(ticketData)
            });

            if (response.ok) {
                const createdTicket = await response.json();
                console.log('Ticket created successfully:', createdTicket);
                
                handleReset();
                alert('Ticket submitted successfully!');
                navigate('/dashboard');  // Redirect to the dashboard after successful ticket submission)
            } else {
                const errorData = await response.json();
                alert(`Failed to submit ticket: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Failed to submit ticket:', error);
            alert('Error submitting ticket. Please try again.');
        }

    };

    


    return(
        <Container>
            <Row>
                <Col>
                    <h1 >Create Ticket</h1>
                    {/*Form implementation with the use of the state variables and event handlers*/}
                    <Form onSubmit={handleSubmit} style={{ marginTop: '2em' }}>
                        <FormGroup>   {/*Form group for the type field*/}
                            <Label for="typeSelect"> <strong>Issue Type*</strong></Label>

                            {/*Select input for the type field and validation using the touched state*/}
                            <Input type="select" name="type" id="typeSelect" value={type} onChange={e => setType(e.target.value)} onBlur={handleBlur('type')} invalid={touched.type && type === ''}>  
                                <option value="">Please select</option>
                                <option value="Incident">Incident</option>
                                <option value="Request">Request</option>
                            </Input>
                            {touched.type && type === '' && <FormFeedback>This field is required.</FormFeedback>} {/*Display the error message if the field is touched and empty*/}
                        </FormGroup>
                        <FormGroup>
                            <Label for="urgencySelect"> <strong>Urgency*</strong> </Label>
                            <Input type="select" name="urgency" id="urgencySelect" value={urgency} onChange={e => setUrgency(e.target.value)} onBlur={handleBlur('urgency')} invalid={touched.urgency && urgency === ''}>
                                <option value="">Please select</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Input>
                            {touched.urgency && urgency === '' && <FormFeedback>This field is required.</FormFeedback>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="titleInput"> <strong> Title* </strong></Label>
                            <Input type="text" name="title" id="titleInput" value={title} onChange={handleTitleChange} onBlur={handleBlur('title')} maxLength={250} invalid={touched.title && validateInput(title, 250) !== ''} />
                            {touched.title && validateInput(title, 250) && <FormFeedback>{validateInput(title, 250)}</FormFeedback>} {/*Display the error message if the field is touched and invalid using FormFeedback*/}
                        </FormGroup>
                        <FormGroup>
                            <Label for="descriptionTextarea"><strong>Description* </strong></Label>
                            <Input type="textarea" name="description" id="descriptionTextarea" value={description} onChange={handleDescriptionChange} onBlur={handleBlur('description')} maxLength={2500} style={{ resize: 'none' }} invalid={touched.description && validateInput(description, 2500) !== ''} />
                            {touched.description && validateInput(description, 2500) && <FormFeedback>{validateInput(description, 2500)}</FormFeedback>}
                            <div className="text-right">{`${charCount}/2500`}</div>
                        </FormGroup>

                        {/*Submit and Reset buttons with validations */}
                        <Button style={{ marginRight: '1em' }}  type="submit" color="primary" disabled={!isFormValid()}>Submit</Button>  
                        <Button type="button" color="secondary" onClick={handleReset} >Reset</Button>
                    </Form>
                </Col>
            </Row>
        </Container>

    );

};

export default CreateTicket;
