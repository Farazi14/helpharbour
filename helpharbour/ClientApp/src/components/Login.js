import React, { Component } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';


export class Login extends Component {
  static displayName = Login.name;

    render() {
        const containerStyle = {
            border: '1px solid #dee2e6', 
            padding: '0.5rem', 
        };


    return (
      <div>
        <h1>Login</h1>
            <Container >
                <Row>
                    <Col md={{ offset: 3, size: 7 }} sm="12">
                        <h3>Please enter your credentials</h3>
                        <Form id="loginForm">
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" id="username" placeholder="Enter your username" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password" placeholder="Enter your password" />
                            </FormGroup>
                            <div className="text-center">
                                <Button color="primary" type="submit">Submit</Button>{' '}
                                <Button color="secondary" onClick={this.resetForm}>Reset</Button>
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
  }
}