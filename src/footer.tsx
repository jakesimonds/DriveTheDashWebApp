import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-3 bg-dark text-white">
      <Container>
        <Row>
          <Col className="text-center">
            this is an unofficial fan site for the Dash Robot
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
