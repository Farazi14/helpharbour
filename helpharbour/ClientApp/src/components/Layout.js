import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

    render() {
        const containerStyle = {
            border: '1px solid #dee2e6', // Example border: solid, 1px, with a light grey color
            padding: '0.5rem', // Optional: to ensure there's some space inside the container
        };

    return (
      <div>
        <NavMenu />
            <Container style={containerStyle}>
                {this.props.children}
            </Container>
      </div>
    );
  }
}
