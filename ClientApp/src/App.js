import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';

import history  from './helpers/history';
import PrivateRoute  from './components/Login/PrivateRoute';
import Login  from './components/Login/Login';
import Register  from './components/Login/Register';
import Main from './components/Main'

import './custom.css'

export default class App extends Component {
  static displayName = App.name;
  render () {
    return (
    <Router history={history}>
      <div>
        <PrivateRoute exact path="/home" component={Main} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </div>
    </Router>
    );
  }
}
