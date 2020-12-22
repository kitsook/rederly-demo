import React, { useState } from 'react';
import { Jumbotron, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import LoginForm from '../Login/LoginForm';
import RegisterForm from '../Login/RegisterForm';
import { Modal, Button } from 'react-bootstrap';

import './HomePage.css';

enum HomeDetailsTabs {
    LOGIN = 'Login',
    REGISTER = 'Register',
}

interface HomePageProps {

}

export const HomePage: React.FC<HomePageProps> = () => {
    const [activeTab, setActiveTab] = useState<HomeDetailsTabs>(HomeDetailsTabs.LOGIN);

    const [showDemoDialog, setShowDemoDialog] = useState(true);
    const handleCloseDemoDialog = () => setShowDemoDialog(false);

    return (
        <>
            <Jumbotron id="HomePageJumbo" fluid>
                <h1 id="JumboText">Rederly Coursework</h1>
            </Jumbotron>

            <Container>
                <Row>
                    <Col md={{ span: 4, offset: 4 }}>
                        <h3>Rederly Coursework</h3>
                        <Tabs
                            activeKey={activeTab}
                            defaultActiveKey={HomeDetailsTabs.LOGIN}
                            id="home-page-tabs"
                            onSelect={(activeTab: any) => {
                                setActiveTab(activeTab);
                            }}
                            style={{
                                marginTop: '20px'
                            }}
                        >
                            <Tab eventKey={HomeDetailsTabs.LOGIN} title={HomeDetailsTabs.LOGIN} style={{ marginBottom: '10px' }}>
                                <LoginForm />
                            </Tab>
                            <Tab eventKey={HomeDetailsTabs.REGISTER} title={HomeDetailsTabs.REGISTER} style={{ marginBottom: '10px' }}>
                                <RegisterForm />
                            </Tab>
                        </Tabs>
                        <Row>
                            <Col style={{ margin: '10px' }} className="text-center">
                                <a href="https://rederly.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Modal show={showDemoDialog} onHide={() => setShowDemoDialog(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Rederly Demo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This is <b>not</b> the offical Rederly demo site. For more information about Rederly, please visit their <a href="https://rederly.com" target="_blank" rel="noopener noreferrer">web site</a>.</p>
                    <p>The purpose of this site is to explore functionalities provided by Rederly. Some logins and courses have been preloaded and <b>all data will be reset everyday at 3am PT</b>. Do not enter any sensitive data to this site.</p>
                    <br />
                    <h5>Logins</h5>
                    <ul>
                        <li>Professors: prof1@example.com, prof2@example.com, ..., prof10@example.com</li>
                        <li>Students: student1@example.com, student2@example.com, ..., student600@example.com</li>
                    </ul>
                    <p>All logins use the same password <mark>letmein</mark></p>
                    <h5>Open Problem Library</h5>
                    <p>A copy of the Open Problem Library is included. When editing a question, you may find library templates under the directory "Library/". Refer to the <a href="https://github.com/openwebwork/webwork-open-problem-library" target="_blank" rel="noopener noreferrer">Open Problem Library</a> for the folder structure and file name.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={handleCloseDemoDialog}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default HomePage;