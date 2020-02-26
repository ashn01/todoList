import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';

import  history  from './helpers/history';
import  authenticationService  from './services/authentication.service';
import  PrivateRoute  from './components/Login/PrivateRoute';
import  Homepage  from './components/Homepage/Homepage';
import  Login  from './components/Login/Login';

import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe(x => this.setState({
      currentUser: x
    }));
  }

  logout() {
    authenticationService.logout();
    history.push('/login');
  }
  render () {
    const { currentUser } = this.state;
    return (
    <Router history={history}>
      <div>
          {/* {currentUser &&
              <nav className="navbar navbar-expand navbar-dark bg-dark">
                  <div className="navbar-nav">
                      <Link to="/home" className="nav-item nav-link">Home</Link>
                      <a onClick={this.logout} className="nav-item nav-link">Logout</a>
                  </div>
              </nav> }*/
          }
          <div className="jumbotron">
              <div className="container">
                  <div className="row">
                      <div className="col-md-6 offset-md-3">
                          <PrivateRoute exact path="/home" component={Homepage} />
                          <Route path="/login" component={Login} />
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </Router>
    );
  }
}
