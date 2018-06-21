import React, { Component } from 'react';
import Input from '../library/Input';
import { PostData } from '../library/PostData';
import { objectToQueryString } from '../library/objectToQueryString';

class FormForgotPassword extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      sendMail: '',
      error: ''
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    PostData('auth/forgotpassword', objectToQueryString(this.state)).then ((result) => {
      if (result === true) {
        this.setState({sendMail: 'Check your email, we sended all needed information'})
      } else {
        this.setState({error: 'Wrong email'})
      }
    })
  }

  handleEmail(event) {
    this.setState({email: event.target.value});
  }

  handlePassword(event) {
    this.setState({password: event.target.value});
  }

  render() {

    const { sendMail } = this.state
    const { error } = this.state
    return (
      <form className="card-content" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="input-field col s12">
            <Input type="email" name="email" className="validate" id="forgetPasswordEmail" value={this.state.email} onChange={this.handleEmail}/>
            <label htmlFor="email">Email</label>
          </div>
        </div>
        <div className="row registrationFormError">
          <button type="submit" className="waves-effect waves-light btn-small btn-color">Send password</button>
          { sendMail && ( <span className="alert alert-success">{this.state.sendMail}</span>)}
          { error && ( <span className="alert alert-danger">{this.state.error}</span>)}
        </div>
    </form>
    );
  }
}

export default FormForgotPassword;
