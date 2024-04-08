import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setLoggedIn } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Send a request to the backend for authentication
        const response = await fetch('https://localhost:7260/api/useraccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            // If authentication is successful
            setLoggedIn(true);
            navigate('/dashboard');
        } else {
            // If authentication fails
            alert('Authentication failed. Please check your credentials.');
        }
    };

    const handleReset = () => {
        setUsername('');
        setPassword('');
    };

    return (
        <div>
            <h1>Login</h1>
            <Container>
                <Row>
                    <Col md={{ offset: 3, size: 6 }} sm="12">
                        <h3>Please enter your credentials</h3>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </FormGroup>
                            <div className="text-center">
                                <Button color="primary" type="submit">Submit</Button>{' '}
                                <Button color="secondary" onClick={handleReset}>Reset</Button>
                            </div>
                        </Form>
                        <div className="text-center mt-4">
                            <hr />
                            <p>Please click the following link to sign up</p>
                            <Button color="link">Register</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
