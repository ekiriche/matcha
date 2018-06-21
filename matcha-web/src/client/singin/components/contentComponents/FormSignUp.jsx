import React, { Component } from 'react';
import Input from '../library/Input';
import { PostData } from '../library/PostData';

class FormSignUp extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      login: '',
      password: '',
      password_repeat: '',
      firstnameError: '',
      lastnameError: '',
      emailError: '',
      loginError: '',
      passwordError: '',
      password_repeatError: '',
      registrationFalse: '',
      registrationSuccess: ''
    };

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordRepeatChange = this.handlePasswordRepeatChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showFormValidError = this.showFormValidError.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    PostData('auth/signup', this.state).then ((result) => {
      if (result === 'OK') {
        this.setState({ registrationSuccess : 'Registration successful' });
      } else {
        this.setState({ registrationFalse : 'Registration failed' });
      }
    })
  }

  handleFirstNameChange(event) {
    this.showFormValidError('firstname', 'firstnameError');
    this.setState({[event.target.name]: event.target.value});
  }

  handleLastNameChange(event) {
    this.showFormValidError('lastname', 'lastnameError');
    this.setState({[event.target.name]: event.target.value});
  }

  handleLoginChange(event) {
    this.showFormValidError('login', 'loginError');
    this.setState({ login : this.state.login.toLowerCase() });
    //this.state.login = this.state.login.toLowerCase();
    this.setState({[event.target.name]: event.target.value});
  }

  handleEmailChange(event) {
    this.showFormValidError('email', 'emailError');
    this.setState({[event.target.name]: event.target.value});
  }

  handlePasswordChange(event) {
    this.showFormValidError('password', 'passwordError');
    this.setState({[event.target.name]: event.target.value});
  }

  handlePasswordRepeatChange(event) {
    this.showFormValidError('password_repeat', 'password_repeatError');
    this.setState({[event.target.name]: event.target.value});
  }

  showFormValidError(serverErrorMassage , outPutErrorMassage) {
    setTimeout(function() {
      PostData('auth/signup_' + serverErrorMassage, this.state).then ((result) => {
      if (typeof result[serverErrorMassage] === 'undefined')
        this.setState({ [outPutErrorMassage] : '' });
      else
        this.setState({ [outPutErrorMassage] : result[serverErrorMassage][0] });
      })
    }.bind(this), 500);
  }

  render() {
    const { firstnameError } = this.state
    const { lastnameError } = this.state
    const { emailError } = this.state
    const { loginError } = this.state
    const { passwordError } = this.state
    const { password_repeatError } = this.state
    const { registrationFalse } = this.state
    const { registrationSuccess } = this.state

   /* navigator.geolocation.getCurrentPosition(showPosition);

    function showPosition(position) {
      console.log(position.coords.latitude);              //geolocation
      console.log(position.coords.longitude);
      console.log(position.coords.accuracy);
    }*/

    return (

      <form className="card-content" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="input-field col s6">
            <Input type="text" name="firstname" required className="validate" id="first_name" value={this.state.firstName} onChange={this.handleFirstNameChange}/>
             <label htmlFor="first_name">First Name</label>
               {firstnameError && ( <span className="invalidInput">{this.state.firstnameError}</span>)}

          </div>
          <div className="input-field col s6">
            <Input type="text" name="lastname" required className="validate" id="last_name" value={this.state.lastName} onChange={this.handleLastNameChange}/>
            <label htmlFor="last_name">Last Name</label>
            {lastnameError && ( <span className="invalidInput">{this.state.lastnameError}</span>)}
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <Input type="text" name="login" required className="validate" id="login" value={this.state.login} onChange={this.handleLoginChange}/>
            <label htmlFor="login">Login</label>
            {loginError && ( <span className="invalidInput">{this.state.loginError}</span>)}
          </div>
          <div className="input-field col s6">
            <Input type="email" name="email" required className="validate" id="email" value={this.state.email} onChange={this.handleEmailChange}/>
            <label htmlFor="email">Email</label>
            {emailError && ( <span className="invalidInput">{this.state.emailError}</span>)}
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <Input type="password" name="password" required className="validate" id="password" value={this.state.password} onChange={this.handlePasswordChange}/>
            <label htmlFor="password">Password</label>
            {passwordError && ( <span className="invalidInput">{this.state.passwordError}</span>)}
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <Input type="password" name="password_repeat" required className="validate" id="password_repeat" value={this.state.password_repeat} onChange={this.handlePasswordRepeatChange}/>
            <label htmlFor="password">Repeat password</label>
            {password_repeatError && ( <span className="invalidInput">Password is wrong</span>)}
          </div>
        </div>
        <div className="row registrationFormError">
          <button type="submit" className="waves-effect waves-light btn-small btn-color">Sign up</button>
          {registrationFalse && ( <span className="alert alert-danger">{this.state.registrationFalse}</span>)}
          {registrationSuccess && ( <span className="alert alert-success">{this.state.registrationSuccess}</span>)}
        </div>
      </form>
    );
  }
}
export default FormSignUp;
