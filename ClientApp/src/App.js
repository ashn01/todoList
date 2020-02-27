import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Main from './components/Main'

import './custom.css'

export default class App extends Component {
  static displayName = App.name;
  render () {
    return (
      <Router>
        <div>
          <Route exact path="/home" render={(props)=> <Main contents="home"/>} />
          <Route path="/login" render={(props)=> <Main contents="login"/>} />
          <Route path="/register" render={(props)=> <Main contents="register"/>} />
        </div>
      </Router>
    );
  }
}
