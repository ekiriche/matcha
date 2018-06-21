import React, { Component } from 'react';
import { Route, Switch, Router} from "react-router-dom";
import history from './client/history/history';

//import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
//import * as mdc from 'material-components-web';
import './App.css';
import { PrivateRoute, SingInRoute } from './client/routing/Auth';
import NotFound from './client/routing/NotFound';

/*Pages*/
import { SingIn } from './client/singin/SingIn';
import  MainPage from './client/main/MainPage';

/*  <Route exact path="/main" component={Main}/>*/
class App extends Component {

  render() {
    return (
      <Router history={history} >
        <div className="appFlex">
          <Switch>
            <SingInRoute exact path="/" strict component={SingIn}/>
            <PrivateRoute path="/" component={MainPage}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
