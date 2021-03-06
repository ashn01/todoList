import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import Main from './components/Main'

import './custom.css'

export default class App extends Component {
  static displayName = App.name;
  render () {
    return (
      <Router>
        <Switch>
            <Route exact path="/home" render={(props)=> <Main contents="home"/>} />
            <Route path="/login" render={(props)=> <Main contents="login"/>} />
            <Route path="/register" render={(props)=> <Main contents="register"/>} />
            <Route path="/forgotPassword" render={(props)=> <Main contents="forgotPassword"/>} />
            <Route path="/account/verifyUser" render={(props)=> <Main contents="verification"/>}/>
            <Route path="/account/resetUserPassword" render={(props)=> <Main contents="resetPassword"/>}/>
            <Redirect to='/login'/>
          </Switch>
      </Router>
    );
  }
}
