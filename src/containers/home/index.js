import React, {Component} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './home.css';
import {bounce} from 'react-animations';
import Radium, {StyleRoot} from 'radium';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: '', isLoggedIn: false};
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleLogin(e) {
        e.preventDefault();
        fetch('http://localhost:8000/api/authenticate-user-login', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: this.state.email, password: this.state.password})
        }).then(res => res.json()
        ).then(response => {
                if( response.status === 'success' ){
                    localStorage.setItem('token', response.api_key)
                    this.setState({
                        'isLoggedIn': true
                    });
                    this.props.history.push('/employees');
                }
                else{
                    this.props.history.push('/');
                }
            }
        ).catch(error => {
            console.log(error);
            console.log("Can’t access API response. Blocked by browser?");
        });
    }

    handleLogout() {
        localStorage.removeItem('token');
        this.setState({
            'isLoggedIn': false
        });
        this.props.history.push('/');
    }

    render() {

        const styles = {
            bounce: {
                animation: 'x 1s',
                animationName: Radium.keyframes(bounce, 'bounce')
            }
        }

        const isLoggedIn = !!localStorage.getItem('token');

        if (!isLoggedIn) {
            return (
                <StyleRoot>
                    <div className={'login-form'} style={styles.bounce}>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" onChange={this.handleEmailChange}
                                              name={'email'}/>
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password"
                                              onChange={this.handlePasswordChange}
                                              name={'password'}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={this.handleLogin}>
                                Login
                            </Button>
                        </Form>
                    </div>
                </StyleRoot>
            );
        } else {
            return (
                <div className="col-md-12">
                    <h1>Welcome Back!</h1>
                    <Button className={"btn-danger btn-sm"} onClick={this.handleLogout}>Logout</Button>
                </div>
            );
        }

    }
}

export default App
