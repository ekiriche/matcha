import React, { Component } from 'react';

/*library*/
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
//import ReactDOM from 'react-dom';
//import $ from 'jquery';
//import Input from '../library/Input';
import './Content.css'

/*Blocks*/
import FormSignIn from './FormSignIn';
import FormSignUp from './FormSignUp';
import FormForgotPassword from './FormForgotPassword';
import BackgroundVidoe from './BackgroundVideo';

class Content extends Component {

  constructor(probs) {
    super( probs )
    this.state = { showFormSignIn : true };
    this.state = { showFormSignUp : false };
    this.state = { showFormForgetPassword : false };
    this.state = { activeP: false };
    this.state = { activeUp: false };
    this.state = { activeIn: false };
    this.toggleFormForgetPassword = this.toggleFormForgetPassword.bind(this);
    this.toggleFormSignUp = this.toggleFormSignUp.bind(this);
    this.toggleFormSignIn = this.toggleFormSignIn.bind(this);
  }

  toggleFormForgetPassword = () => {
    const currentState = this.state.active;
    this.setState( {showFormForgetPassword : true })
    this.setState( {showFormSignIn : false })
    this.setState( {showFormSignUp : false })
    this.setState({ activeUp: false });
    this.setState({ activeP: !currentState });
    this.setState({ activeIn: false });

  }

  toggleFormSignUp = () => {
    const currentState = this.state.active;
    this.setState( {showFormSignUp : true })
    this.setState( {showFormSignIn : false })
    this.setState( {showFormForgetPassword : false })
    this.setState({ activeUp: !currentState });
    this.setState({ activeP: false });
    this.setState({ activeIn: false });
  }

  toggleFormSignIn = () => {
    const currentState = this.state.active;
    this.setState( {showFormSignIn : true })
    this.setState( {showFormSignUp : false })
    this.setState( {showFormForgetPassword : false })
    this.setState({ activeUp: false });
    this.setState({ activeP: false });
    this.setState({ activeIn: !currentState });
  }

  render() {
    return (
      <div className="container margin-mobile">
        <div className="row">
          <div className="col s1 m0 l3"></div>
          <div className="card card-height col s12 m10 l6 xl6 z-depth-2">
            <div className="card-tabs">
              <ul className="tabs tabs-fixed-width">
                <li className="tab loginTabMargin"><a onClick={ this.toggleFormSignIn } className={this.state.activeIn ? 'active': null} >Sign in</a></li>
                <li className="tab loginTabMargin"><a onClick={ this.toggleFormSignUp } className={this.state.activeUp ? 'active': null}>Sign up</a></li>
                <li className="tab loginTabMargin"><a onClick={ this.toggleFormForgetPassword } className={this.state.activeP ? 'active': null}>Forgot password ?</a></li>
              </ul>
            </div>
            <div className="lighten-4">
              <div>
                { this.state.showFormSignIn !== false && <FormSignIn />}
              </div>
              <div>
                { this.state.showFormSignUp && <FormSignUp />}
              </div>
              <div>
                { this.state.showFormForgetPassword && <FormForgotPassword />}
              </div>
            </div>
          </div>
          <div className="col s1 m0 l4"></div>
          <BackgroundVidoe />
        </div>
      </div>
    );
  }
}

export default Content;
