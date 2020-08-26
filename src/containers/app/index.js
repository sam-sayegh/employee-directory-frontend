import React from 'react'
import {Route, Link} from 'react-router-dom'
import Home from '../home'
import About from '../about'
import Departments from '../departments'
import Employees from '../employees'
import "bootstrap/scss/bootstrap.scss";

const App = () => (
    <div>
        <header className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/about-us">About</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/departments">Departments</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/employees">Employees</Link>
                </li>
            </ul>
        </header>

        <main>
            <Route exact path="/" component={Home}/>
            <Route exact path="/about-us" component={About}/>
            <Route exact path="/departments" component={Departments}/>
            <Route exact path="/employees" component={Employees}/>
        </main>
    </div>
);

export default App
